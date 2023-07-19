# 원티드 프리온보딩 인턴십 11차 4주차 과제
# 목차
1. [시작하기](#시작하기)  
  1.1 [사용 방법](#사용-방법)  
  1.2 [기술 스택]()
3. [과제](#과제)
4. [구현](#구현)  

# 시작하기
## 사용 방법  
구성된 백엔드 레포지토리  
[backend-repo](https://github.com/walking-sunset/assignment-api)  

```
> git clone https://github.com/WONILLISM/pre-onboarding-11th-4.git
> cd pre-onboarding-11th-4
> npm install
> npm start
```


## 기술 스택
<div>
<img src="https://img.shields.io/badge/VisualStudioCode-007ACC?style=flat&logo=visualstudiocode&logoColor=white" /> <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=Git&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&logoColor=white" />
</div>
<div>
<img src="https://img.shields.io/badge/Node.js-v18.16.1-339933?style=flat&logo=Node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat&logo=Javascript&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" /> <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white" />    
</div>  

# 과제
## 과제 설명
- 아래 사이트의 검생영역 클론하기
- [한국 임상 정보](https://clinicaltrialskorea.com/)
- 질환명 검색시 API 호출을 통해서 검색어 추천기능 구현
## 과제 task
- [ ] API 호출별로 로컬 캐싱 구현
  - 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
  - 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
- [ ] expire time을 구현할 경우 가산점
- [ ] 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
- [ ] API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
- [ ] 키보드만으로 추천 검색어들로 이동 가능하도록 구현


# 구현
TanStack [react-query](https://tanstack.com/query/v3/)의 useQuery와 최대한 비슷하게 구현해보고자 한다.

