---
title: "[TAS] Advanced V.G. 2"
excerpt: ""
categories:
  - etc
classes: wide  
---

### 영상 ###

<iframe width="560" height="315" src="https://www.youtube.com/embed/S3OAiwewAPY?si=XMXfGLiBNFscgiWH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<br>
해당 TAS 에뮬레이터가 업데이트되면서 기존 TAS파일을 유실해버렸다. 

그나마 건진 게 이 정도고 어떻게 보기 좋게 인코딩했는지 기억이 안난다. 

게다가 기존 파일을 실수로 새파일로 덮어씌워버려서 CPU와 대전하는 맛깔나는 TAS도 더 이상 볼 수 없다..

**아래는 해킹 중 기록한 것들**

```
800C8E78,WORD       		// 체력
800C546C            		// 커맨드 계산 루틴
-----------------------------------------------------------------------
800629A0 ~ 80062A90   		// 1P 커맨드 공간
80062A93            		// 2p 커맨드 공간
0007C3C8            		// 레미 기술 데이터
0C9364,DWORD 			// 1P게이지
0C9358,WORD  		    	// 1P이동위치
0C935A,WORD  		    	// 1P공중위치
0c935C WORD  		    	// 1P히트백
0c935E WORD  		    	// 1P착지값
-----------------------------------------------------------------------
0C98F4,WORD 		    	// 2P,CPU위치
0C98F6,WORD 		    	// 2P,CPU공중위치
0C98F8,WORD 		    	// 2P,CPU히트백
0C98FA,WORD 		    	// 2P,CPU착지값
0C99A1,BYTE 		    	// 2P,CPU히트수
0C99CD,BYTE 		    	// 2P,CPU히트수 제한

ex)
memory.writebyte(0xc941c,0x2f)
memory.writebyte(0xc93bf,0x05)
-----------------------------------------------------------------------
memory.write_u16_be(0xc901a,0x0180) 기술 데이터(데미지,히트수,히트백 등)
memory.write_u16_be(0xc9020,0x2003)
memory.writebyte(0xc9024,0x20)
memory.write_u16_be(0xc9022,0x4100)
memory.writebyte(0xc902b,0x0a)
memory.writebyte(0xc902a,0x12)
memory.writebyte(0xc9025,0x06)
memory.writebyte(0xc902c,0x07)
-----------------------------------------------------------------------
memory.writebyte(0xc93c0,0x37) 기술 코드
memory.writebyte(0xc93c1,0x01)
memory.writebyte(0xc93c2,0x45)
memory.writebyte(0xc93c3,0x01)
-----------------------------------------------------------------------
memory.writebyte(0xc941d,0x2f) 입력 코드?
memory.writebyte(0xc941e,0x2f)
memory.writebyte(0xc941f,0x01)
memory.writebyte(0xc942e,0x32)
memory.writebyte(0xc942f,0x32)

memory.writebyte(0xc93b8,0x37)	// 기술코드를 이 주소에 복사함
memory.writebyte(0xc93b9,0x01)
memory.writebyte(0xc93ba,0x37)	// 기술코드를 이 주소에 복사함
memory.writebyte(0xc93bb,0x01)
```



