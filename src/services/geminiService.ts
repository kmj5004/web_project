import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

// Google Gemini AI API를 사용한 AI 상담 서비스
// 실제 환경에서는 Google AI Studio에서 API 키를 발급받아 사용해야 합니다.

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private isInitialized: boolean = false;
  private initializationError: string | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      console.log('Gemini 초기화 시작...');
      console.log('API 키 존재 여부:', !!apiKey);

      if (!apiKey) {
        this.initializationError = 'VITE_GEMINI_API_KEY 환경변수가 설정되지 않았습니다.';
        console.warn(this.initializationError);
        return;
      }

      
      

      this.genAI = new GoogleGenerativeAI(apiKey);

      
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      this.isInitialized = true;
      this.initializationError = null;

      console.log('Gemini AI 서비스가 성공적으로 초기화되었습니다.');
    } catch (error) {
      this.initializationError = error instanceof Error ? error.message : '알 수 없는 초기화 오류';
      console.error('Gemini AI 초기화 실패:', error);
      this.isInitialized = false;
    }
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    console.log('generateResponse 호출됨:', { message: message.substring(0, 50) + '...', hasContext: !!context });

    if (!this.isInitialized || !this.model) {
      console.log('Gemini AI가 초기화되지 않았습니다. 기본 응답을 사용합니다.');
      console.log('초기화 오류:', this.initializationError);
      return this.getFallbackResponse(message);
    }

    try {
      const prompt = this.buildPrompt(message, context);
      console.log('프롬프트 생성 완료, API 호출 시작...');

      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API 요청 타임아웃 (30초)')), 30000);
      });

      const apiPromise = this.model.generateContent(prompt);

      const result = await Promise.race([apiPromise, timeoutPromise]);
      const response = result.response;
      const text = response.text();

      console.log('API 응답 받음 (길이):', text.length);
      console.log('응답 미리보기:', text.substring(0, 100) + '...');

      return text;
    } catch (error) {
      console.error('Gemini API 에러:', error);
      return this.handleApiError(error, message);
    }
  }

  private buildPrompt(message: string, context?: string): string {
    return `
당신은 중고차 거래 플랫폼 CarMarket의 전문 상담사입니다. 
사용자의 질문에 대해 친절하고 전문적으로 답변해주세요.

${context ? `상황: ${context}` : ''}

사용자 질문: ${message}

답변 시 다음 사항을 고려해주세요:
- 한국어로 답변
- 친근하고 전문적인 톤
- 중고차 구매/판매에 도움이 되는 실용적인 정보 제공
- 안전한 거래를 위한 조언 포함
- 답변은 간결하되 유용한 정보를 포함
`;
  }

  private handleApiError(error: any, originalMessage: string): string {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('api_key') || errorMessage.includes('api key')) {
        console.error('API 키 관련 오류입니다.');
        return '서비스 설정에 문제가 있습니다. 관리자에게 문의해주세요.';
      }

      if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        console.error('API 할당량 초과입니다.');
        return '현재 서비스 이용량이 많습니다. 잠시 후 다시 시도해주세요.';
      }

      if (errorMessage.includes('timeout')) {
        console.error('요청 시간 초과입니다.');
        return '응답 시간이 초과되었습니다. 다시 시도해주세요.';
      }

      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        console.error('네트워크 오류입니다.');
        return '네트워크 연결을 확인하고 다시 시도해주세요.';
      }
    }

    
    console.error('예상치 못한 API 오류:', error);
    return this.getFallbackResponse(originalMessage);
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    
    if (lowerMessage.includes('가격') || lowerMessage.includes('얼마') || lowerMessage.includes('시세')) {
      return '차량 가격은 연식, 주행거리, 차량 상태 등 여러 요인에 따라 결정됩니다. 시세 확인을 위해 비슷한 조건의 다른 차량들과 비교해보시는 것을 추천드립니다. 구체적인 차량 정보를 알려주시면 더 정확한 가격 조언을 드릴 수 있습니다.';
    }

    
    if (lowerMessage.includes('구매') || lowerMessage.includes('사고싶') || lowerMessage.includes('살때')) {
      return '중고차 구매 시 다음 사항들을 확인해보세요:\n\n1. 차량 외관 및 내부 상태 점검\n2. 엔진 및 기계적 상태 확인\n3. 사고 이력 및 정비 기록 검토\n4. 실제 시승을 통한 주행 성능 확인\n5. 필요 서류 준비 및 명의 이전 절차\n\n안전한 거래를 위해 신뢰할 수 있는 판매자와 거래하시기 바랍니다.';
    }

    
    if (lowerMessage.includes('판매') || lowerMessage.includes('팔고싶')) {
      return '차량 판매를 위한 준비사항을 안내드립니다:\n\n1. 차량 청소 및 정비로 상태 개선\n2. 정확한 차량 정보 및 사진 준비\n3. 적정 판매 가격 설정 (시세 조사)\n4. 필요 서류 준비 (등록증, 정비 기록 등)\n5. 안전한 거래 장소 및 방법 선택\n\n차량 등록 페이지에서 쉽게 매물을 등록하실 수 있습니다.';
    }

    return '안녕하세요! CarMarket 상담사입니다. 중고차 구매, 판매, 가격 문의 등 어떤 도움이 필요하신지 구체적으로 말씀해주시면 더 정확한 답변을 드릴 수 있습니다. 언제든 편하게 문의해주세요! 😊';
  }

  async generateChatSuggestion(carInfo: any, userMessage: string): Promise<string> {
    if (!this.isInitialized || !this.model) {
      return `${carInfo.title}에 관심을 가져주셔서 감사합니다. 차량에 대해 궁금한 점이 있으시면 언제든 문의해주세요!`;
    }

    try {
      const prompt = `
당신은 중고차 판매자입니다. 다음 차량에 대한 구매 문의에 답변해주세요.

차량 정보:
- 제목: ${carInfo.title}
- 가격: ${carInfo.price}만원
- 연식: ${carInfo.year}년
- 주행거리: ${carInfo.mileage}km
- 위치: ${carInfo.location}

구매자 문의: ${userMessage}

친근하고 신뢰할 수 있는 톤으로 답변해주세요.
`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Chat suggestion 생성 에러:', error);
      return `${carInfo.title}에 관심을 가져주셔서 감사합니다. 차량 상태는 매우 양호하며, 직접 확인해보시면 만족하실 것 같습니다. 언제든 연락주세요!`;
    }
  }

  async generateNaturalResponse(carInfo: any, userMessage: string, conversationHistory: any[] = []): Promise<string> {
    if (!this.isInitialized || !this.model) {
      return `${carInfo.title}에 관심을 가져주셔서 감사합니다. 차량에 대해 궁금한 점이 있으시면 언제든 문의해주세요!`;
    }

    try {
      // 대화 히스토리에서 컨텍스트 추출
      const conversationContext = conversationHistory.length > 0 
        ? conversationHistory.map(msg => `${msg.senderId === 'user' ? '구매자' : '판매자'}: ${msg.message}`).join('\n')
        : '';

      // 사용자 메시지 분석을 위한 키워드 추출
      const lowerMessage = userMessage.toLowerCase();
      const isQuestion = userMessage.includes('?') || userMessage.includes('요') || userMessage.includes('까');
      const isGreeting = lowerMessage.includes('안녕') || lowerMessage.includes('반갑') || lowerMessage.includes('처음');
      const isPriceInquiry = lowerMessage.includes('가격') || lowerMessage.includes('얼마') || lowerMessage.includes('시세');
      const isConditionInquiry = lowerMessage.includes('상태') || lowerMessage.includes('깨끗') || lowerMessage.includes('사고');
      const isTestDrive = lowerMessage.includes('시승') || lowerMessage.includes('타보') || lowerMessage.includes('운전');
      const isLocation = lowerMessage.includes('위치') || lowerMessage.includes('어디') || lowerMessage.includes('장소');

      const prompt = `
당신은 중고차 판매자입니다. 구매자와의 자연스러운 대화를 이어가세요.

차량 정보:
- 제목: ${carInfo.title}
- 가격: ${carInfo.price}만원
- 연식: ${carInfo.year}년
- 주행거리: ${carInfo.mileage}km
- 위치: ${carInfo.location}

${conversationContext ? `이전 대화:\n${conversationContext}\n` : ''}

구매자 메시지: ${userMessage}

메시지 분석:
- 질문 여부: ${isQuestion ? '예' : '아니오'}
- 인사말: ${isGreeting ? '예' : '아니오'}
- 가격 문의: ${isPriceInquiry ? '예' : '아니오'}
- 상태 문의: ${isConditionInquiry ? '예' : '아니오'}
- 시승 문의: ${isTestDrive ? '예' : '아니오'}
- 위치 문의: ${isLocation ? '예' : '아니오'}

다음 사항을 고려하여 자연스럽고 친근하게 답변해주세요:
- 대화 맥락을 고려한 연속성 있는 답변
- 차량에 대한 전문적이면서도 친근한 설명
- 구매자의 관심사에 맞는 맞춤형 정보 제공
- 이모티콘을 적절히 사용하여 친근감 표현 (하지만 과도하지 않게)
- 질문이 있으면 자연스럽게 물어보기
- 답변은 1-3문장 정도로 간결하게
- 다양한 응답 패턴 사용 (단조롭지 않게)
- 구체적인 정보 제공 (가격, 위치, 시승 가능 여부 등)

판매자로서의 답변:
`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Natural response 생성 에러:', error);
      
      // 에러 시 다양한 기본 응답 중에서 선택 (메시지 내용에 따라)
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('가격') || lowerMessage.includes('얼마')) {
        const priceResponses = [
          `${carInfo.title}의 가격은 ${carInfo.price}만원입니다. 시세 대비 합리적인 가격으로 설정했어요! 😊`,
          `${carInfo.price}만원으로 설정했는데, 차량 상태를 보시면 정말 좋은 가격이라고 생각하실 거예요.`,
          `현재 ${carInfo.price}만원에 판매 중입니다. 직접 확인해보시면 가격이 합리적이라는 걸 아실 거예요! 👍`
        ];
        return priceResponses[Math.floor(Math.random() * priceResponses.length)];
      }
      
      if (lowerMessage.includes('상태') || lowerMessage.includes('깨끗')) {
        const conditionResponses = [
          `${carInfo.title}는 정말 깨끗하고 상태가 좋아요! 직접 확인해보시면 만족하실 거예요.`,
          `차량 상태는 매우 양호합니다. 사고 이력도 없고 정기 정비도 잘 되어 있어요! 😄`,
          `상태가 정말 좋은 차량이에요. 외관도 깨끗하고 내부도 깔끔하게 관리되어 있습니다.`
        ];
        return conditionResponses[Math.floor(Math.random() * conditionResponses.length)];
      }
      
      if (lowerMessage.includes('시승') || lowerMessage.includes('타보')) {
        const testDriveResponses = [
          `네, 시승 가능합니다! ${carInfo.location}에서 언제든 가능해요. 언제 오실 수 있으신가요?`,
          `당연히 시승 가능해요! 직접 타보시면 차량이 얼마나 좋은지 아실 거예요. 😊`,
          `시승은 ${carInfo.location}에서 가능합니다. 편하실 때 연락주세요!`
        ];
        return testDriveResponses[Math.floor(Math.random() * testDriveResponses.length)];
      }
      
      // 기본 응답들
      const fallbackResponses = [
        `${carInfo.title}에 관심을 가져주셔서 감사합니다! 차량에 대해 더 궁금한 점이 있으시면 언제든 말씀해주세요. 😊`,
        `좋은 질문이네요! ${carInfo.title}에 대해 더 자세히 알고 싶으신 부분이 있으시면 편하게 물어보세요.`,
        `감사합니다! ${carInfo.title}는 정말 좋은 차량이에요. 궁금한 점이 있으시면 언제든 문의해주세요! 👍`,
        `${carInfo.title}에 대한 문의 감사합니다. 차량에 대해 더 구체적으로 궁금한 점이 있으시면 알려주세요.`,
        `좋은 선택이에요! ${carInfo.title}에 대해 어떤 부분이 궁금하신지 더 자세히 말씀해주시면 도움드릴게요. 😄`
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }

  
  async testConnection(): Promise<boolean> {
    if (!this.isInitialized || !this.model) {
      return false;
    }

    try {
      const result = await this.model.generateContent('테스트');
      const response = result.response;
      const text = response.text();
      console.log('연결 테스트 성공:', text);
      return true;
    } catch (error) {
      console.error('연결 테스트 실패:', error);
      return false;
    }
  }

  
  getStatus(): { initialized: boolean; hasModel: boolean; apiKey: boolean } {
    return {
      initialized: this.isInitialized,
      hasModel: this.model !== null,
      apiKey: !!import.meta.env.VITE_GEMINI_API_KEY
    };
  }
}

export const geminiService = new GeminiService();