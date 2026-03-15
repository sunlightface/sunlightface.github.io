---
title: "NDS Nitro 2D Sprite Resource Format"
excerpt: ""
categories:
  - nds
classes: wide  
---

<style>
.page__content table {
  display: table !important;
  table-layout: fixed !important;
  width: 80% !important;
}
.page__content td,
.page__content th {
  overflow-wrap: break-word !important;
  word-break: break-word !important;
}
/* 5컬럼 테이블: 오프셋 10% / 크기 8% / 필드 15% / 값 17% / 설명 50% */
.page__content th:nth-child(1),
.page__content td:nth-child(1) { width: 10% !important; }
.page__content th:nth-child(2),
.page__content td:nth-child(2) { width: 8% !important; }
.page__content th:nth-child(3),
.page__content td:nth-child(3) { width: 15% !important; }
.page__content th:nth-child(4),
.page__content td:nth-child(4) { width: 37% !important; }
.page__content th:nth-child(5),
.page__content td:nth-child(5) { width: 30% !important; }
</style>
1. **NCLR (Nitro CoLor Resource)**

   - **파일 헤더 (공통, 16바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x00 | 4 | 매직 | `RLCN` | 리버스 "NCLR" |
     | 0x04 | 2 | BOM | 0xFEFF | 리틀엔디안 |
     | 0x06 | 2 | 버전 | 0x0100 | |
     | 0x08 | 4 | 파일 크기 | 가변 | 전체 바이트 |
     | 0x0C | 2 | 헤더 크기 | 16 | |
     | 0x0E | 2 | 섹션 수 | 1 | |

   - **PLTT 섹션 헤더 (8바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x10 | 4 | 매직 | `TTLP` | 리버스 "PLTT" |
     | 0x14 | 4 | 섹션 크기 | 가변 | 헤더+데이터 |

   - **PLTT 데이터 헤더 (16바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x18 | 4 | bitDepth | 3 | 3=4bpp(16색), 4=8bpp(256색) |
     | 0x1C | 4 | 패딩 | 0 | |
     | 0x20 | 4 | dataSize | 가변 | 팔레트 데이터 크기 (바이트) |
     | 0x24 | 4 | colorStartOffset | 0x10 | 색상 데이터 오프셋 |

   - **팔레트 색상 테이블 (0x28~)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x28 + i×2 | 2 | 색상 i | RGB555 | `R5 \| (G5<<5) \| (B5<<10)` |
     | 16색 = 32바이트 | | (색상 0~15) | | |

2. **NCGR (Nitro Character Graphic Resource)**

   - **파일 헤더 (공통, 16바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x00 | 4 | 매직 | `RGCN` | 리버스 "NCGR" |
     | 0x04 | 2 | BOM | 0xFEFF | |
     | 0x06 | 2 | 버전 | 0x0100 | |
     | 0x08 | 4 | 파일 크기 | 가변 | |
     | 0x0C | 2 | 헤더 크기 | 16 | |
     | 0x0E | 2 | 섹션 수 | 1 | |

   - **CHAR 섹션 헤더 (8바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x10 | 4 | 매직 | `RAHC` | 리버스 "CHAR" |
     | 0x14 | 4 | 섹션 크기 | 가변 | |

   - **CHAR 데이터 헤더 (24바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x18 | 2 | tilesY | 가변 | 세로 타일 수 (8px 단위) |
     | 0x1A | 2 | tilesX | 가변 | 가로 타일 수 (8px 단위) |
     | 0x1C | 4 | pixelFmt | 3 | 3=4bpp, 4=8bpp |
     | 0x20 | 4 | mappingType | 0 | |
     | 0x24 | 4 | characterFmt | 0 | |
     | 0x28 | 4 | szByte | 가변 | 타일 데이터 크기 (바이트) |
     | 0x2C | 4 | pRawData | 0x18 | 타일 데이터 오프셋 |

   - **타일 데이터 (0x30~)**

     | 오프셋  | 크기  | 필드  | 설명  |
     |:---|:---|:---|:---|
     | 0x30 | 가변 | 타일 0 | 4bpp 리니어, boundary 정렬 |
     | 0x30 + align | 가변 | 타일 1 | 4bpp 리니어, boundary 정렬 |
     | ... | ... | ... | 각 타일은 `32 << boundary` 바이트 정렬 |
     | 4bpp: 2픽셀 | 1바이트 | | (하위4bit=픽셀0, 상위4bit=픽셀1) |

3. **NCER (Nitro CEll Resource)**

   - **파일 헤더 (공통, 16바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x00 | 4 | 매직 | `RECN` | 리버스 "NCER" |
     | 0x04 | 2 | BOM | 0xFEFF | |
     | 0x06 | 2 | 버전 | 0x0100 | |
     | 0x08 | 4 | 파일 크기 | 가변 | |
     | 0x0C | 2 | 헤더 크기 | 16 | |
     | 0x0E | 2 | 섹션 수 | 1 | |

   - **CEBK 섹션 헤더 (8바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x10 | 4 | 매직 | `KBEC` | 리버스 "CEBK" |
     | 0x14 | 4 | 섹션 크기 | 가변 | |

   - **CEBK 데이터 헤더 (24바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x18 | 2 | numCells | 가변 | 셀 개수 |
     | 0x1A | 2 | entrySize | 0 | 0=8바이트, 1=16바이트 |
     | 0x1C | 4 | cellDataOffset | 0x18 | 셀 테이블 오프셋 (CEBK+8 기준) |
     | 0x20 | 4 | boundary | 가변 | mappingMode (0~4), 블록=`32<<boundary` |
     | 0x24 | 4 | 예약 | 0 | |
     | 0x28 | 4 | 예약 | 0 | |
     | 0x2C | 4 | 예약 | 0 | |

   - **셀 테이블 (0x30~, 각 8바이트)**

     | 오프셋  | 크기  | 필드  | 설명  |
     |:---|:---|:---|:---|
     | +0 | 2 | numOAMs | 이 셀의 OAM 개수 |
     | +2 | 2 | unknown | 0 |
     | +4 | 4 | oamOffset | OAM 테이블 내 바이트 오프셋 |

   - **OAM 테이블 (셀 테이블 직후, 각 6바이트)**

     | 오프셋  | 크기  | 필드  | 비트  | 설명  |
     |:---|:---|:---|:---|:---|
     | +0 | 2 | attr0 | [7:0] Y좌표 (signed 8bit) | |
     | | | | [9:8] OBJ Mode | |
     | | | | [12] Mosaic | |
     | | | | [13] Color Mode (0=16색) | |
     | | | | [15:14] Shape (0=정사각, 1=가로, 2=세로) | |
     | +2 | 2 | attr1 | [8:0] X좌표 (signed 9bit) | |
     | | | | [12] H-Flip | |
     | | | | [13] V-Flip | |
     | | | | [15:14] Size (0~3) | |
     | +4 | 2 | attr2 | [9:0] 타일 인덱스 | boundary 블록 단위 |
     | | | | [11:10] Priority | |
     | | | | [15:12] 팔레트 인덱스 | |

   - **OAM Shape/Size → 픽셀 크기**

     | Shape\Size  | 0  | 1  | 2  | 3  |
     |:---|:---|:---|:---|:---|
     | 0 (정사각) | 8×8 | 16×16 | 32×32 | 64×64 |
     | 1 (가로) | 16×8 | 32×8 | 32×16 | 64×32 |
     | 2 (세로) | 8×16 | 8×32 | 16×32 | 32×64 |

4. **NANR (Nitro ANimation Resource)**

   - **파일 헤더 (공통, 16바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x00 | 4 | 매직 | `RNAN` | 리버스 "NANR" |
     | 0x04 | 2 | BOM | 0xFEFF | |
     | 0x06 | 2 | 버전 | 0x0100 | |
     | 0x08 | 4 | 파일 크기 | 가변 | |
     | 0x0C | 2 | 헤더 크기 | 16 | |
     | 0x0E | 2 | 섹션 수 | 1 | |

   - **ABNK 섹션 헤더 (8바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x10 | 4 | 매직 | `KNBA` | 리버스 "ABNK" |
     | 0x14 | 4 | 섹션 크기 | 가변 | |

   - **ABNK 데이터 헤더 (24바이트)**

     | 오프셋  | 크기  | 필드  | 값  | 설명  |
     |:---|:---|:---|:---|:---|
     | 0x18 | 2 | numSequences | 가변 | 시퀀스(애니메이션) 개수 |
     | 0x1A | 2 | totalFrames | 가변 | 총 프레임 수 |
     | 0x1C | 4 | seqArrayOffset | 0x18 | 시퀀스 배열 오프셋 (ABNK+8 기준) |
     | 0x20 | 4 | frameArrayOffset | 가변 | 프레임 배열 오프셋 |
     | 0x24 | 4 | resultArrayOffset | 가변 | 결과 배열 오프셋 |
     | 0x28 | 4 | pStringBank | 0 | NULL |
     | 0x2C | 4 | pExtendedData | 0 | NULL |

   - **시퀀스 배열 (각 16바이트)**

     | 오프셋  | 크기  | 필드  | 설명  |
     |:---|:---|:---|:---|
     | +0 | 2 | numFrames | 이 시퀀스의 프레임 수 |
     | +2 | 2 | loopStart | 루프 시작 프레임 |
     | +4 | 4 | animType | `(type<<16) \| elem`, type=1, elem=0 |
     | +8 | 4 | playMode | 1=forward, 2=forward_loop, 3=reverse, 4=reverse_loop |
     | +12 | 4 | frameOffset | 프레임 배열 내 바이트 오프셋 |

   - **프레임 배열 (각 8바이트)**

     | 오프셋  | 크기  | 필드  | 설명  |
     |:---|:---|:---|:---|
     | +0 | 4 | resultOffset | 결과 배열 내 바이트 오프셋 |
     | +4 | 2 | duration | 지속 시간 (프레임 단위) |
     | +6 | 2 | 패딩 | 0 |

   - **결과 배열 (각 2바이트)**

     | 오프셋  | 크기  | 필드  | 설명  |
     |:---|:---|:---|:---|
     | +0 | 2 | cellIndex | 셀(NCER) 인덱스 |