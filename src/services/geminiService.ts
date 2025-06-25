import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

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