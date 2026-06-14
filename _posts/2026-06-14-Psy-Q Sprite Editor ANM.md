---
title: "Psy-Q Sprite Editor ANM Format"
excerpt: ""
categories:
  - psx1
classes: wide  
---

<style>
.page__content table {
  display: table !important;
  table-layout: fixed !important;
  width: 50% !important;
}
.page__content td,
.page__content th {
  overflow-wrap: break-word !important;
  word-break: break-word !important;
}
</style>

ANM은 PlayStation Psy-Q Sprite Editor에서 사용하는 스프라이트 애니메이션 메타데이터 포맷이다. TIM 텍스처를 참조를 하기 위해 별도로 존재하는 파일 정도라 생각하면 된다.

## 기본 식별자

| 항목      |                             값 |
| ------- | ---------------------------- |
| ID      |                       0x21 |
| Version |                       0x03 |
| Endian  |                 Little endian |

## 전체 구조

**Header**: 8byte

| Offset | Size | 이름          | 설명              |
| ----- | --- | ----------- | --------------- |
| 0x00 |    1 | ID        | 0x21          |
| 0x01 |    1 | VERSION   | 0x03          |
| 0x02 |    2 | FLAG      | ANM 플래그         |
| 0x04 |    2 | NSPRITEGp | Sprite Group 개수 |
| 0x06 |    2 | NSEQUENCE | Sequence 개수     |

---

**Sequence**: 8byte, Sequence는 어떤 프레임에서 어떤 Sprite Group을 사용할지 지정한다.  다만 SprGpNo와 TIME은 사용하지 않는 경우도 있는 것 같다.

|  Offset | Size | 이름        | 설명                  |
| ------ | --- | --------- | ------------------- |
| +0x00 |    2 | SprGpNo | 사용할 Sprite Group 번호 |
| +0x02 |    2 | TIME    | 표시 시간               |
| +0x04 |    2 | X       | 기준 X 좌표             |
| +0x06 |    2 | Y       | 기준 Y 좌표             |

---

**Sprite Group**: Sprite Group은 하나 이상의 Sprite Entry를 가진다.

|  Offset |             Size | 이름         | 설명                |
| ------ | --------------- | ---------- | ----------------- |
| +0x00 |                4 | NSprite  | 이 그룹 안의 Sprite 개수 |
| +0x04 | 0x14 * NSprite | Sprite[] | Sprite Entry 배열   |

---

**Sprite Entry**: 20byte,  Sprite Entry는 TIM에서 가져올 위치, 이미지 크기, 출력 보정값, CLUT, 렌더링 플래그를 가진다.

|  Offset | Size | 이름       | 설명                      |
| ------ | --- | -------- | ----------------------- |
| +0x00 |    1 | u      | TIM에서 가져올 X 좌표          |
| +0x01 |    1 | v      | TIM에서 가져올 Y 좌표          |
| +0x02 |    1 | ofsX   | 출력 X 보정값                |
| +0x03 |    1 | ofsY   | 출력 Y 보정값                |
| +0x04 |    2 | CBA    | CLUT / palette 관련 값     |
| +0x06 |    2 | FLAG   | texture/render flag     |
| +0x08 |    2 | W      | 이미지 폭                   |
| +0x0A |    2 | H      | 이미지 높이                  |
| +0x0C |    2 | ROT    | 회전값                     |
| +0x0E |    2 | FLAG2  | 추가 flag                 |
| +0x10 |    2 | ScaleX | X scale. 0x1000 = 1.0 |
| +0x12 |    2 | ScaleY | Y scale. 0x1000 = 1.0 |

---

아래는 이해를 돕기 위해 현재 앞서 언급한 파일 포맷을 바탕으로 디버깅을 통해 확정된 예시들이다.  런타임에 따라 이 파일 정보가 조금씩 다를 수 있다는 것을 명심해야 한다.

## 예시 1: Sprite Group 1개, Sprite 1개

```
21 03 00 00 01 00 01 00 00 00 00 00 F8 FF 00 00 
01 00 00 00 00 60 00 00 03 78 16 00 88 00 18 00 
00 00 01 00 00 10 00 10
```

**Header**:  21 03 00 00 01 00 01 00

| Field       |      값 |
| ----------- | ----- |
| ID        | 0x21 |
| VERSION   | 0x03 |
| FLAG      |    0 |
| NSPRITEGp |    1 |
| NSEQUENCE |    1 |

---

**Sequence**: 00 00 00 00 F8 FF 00 00

| Field     | Raw     |    값 |
| --------- | ------- | --- |
| SprGpNo | 00 00 |  0 |
| TIME    | 00 00 |  0 |
| X       | F8 FF | -8 |
| Y       | 00 00 |  0 |

이 Sequence는 Sprite Group 0번을 사용하며, 기준 좌표는 X=-8, Y=0이다.

---

**Sprite Group**: 01 00 00 00

NSprite = 1이므로 이 그룹에는 Sprite Entry가 1개 있다.

**Sprite Entry**: 00 60 00 00 03 78 16 00 88 00 18 00 00 00 01 00 00 10 00 10

| Field    | Raw     |        값 |
| -------- | ------- | ------- |
| u      | 00    |      0 |
| v      | 60    |   0x60 |
| ofsX   | 00    |      0 |
| ofsY   | 00    |      0 |
| CBA    | 03 78 | 0x7803 |
| FLAG   | 16 00 | 0x0016 |
| W      | 88 00 |    136 |
| H      | 18 00 |     24 |
| ROT    | 00 00 |      0 |
| FLAG2  | 01 00 |      1 |
| ScaleX | 00 10 | 0x1000 |
| ScaleY | 00 10 | 0x1000 |

해석하면 이 Sprite는 TIM의 (u=0, v=0x60) 위치에서 136 x 24 영역을 가져온다. 출력 보정값은 ofsX=0, ofsY=0이고, scale은 X/Y 모두 0x1000, 즉 1.0이다.

---

## 예시 2: Sprite Group 2개, 각 Group에 Sprite 1개

```
21 03 01 00 02 00 02 00 00 00 00 00 00 00 00 00 
01 00 00 00 00 00 00 00 01 00 00 00 00 38 80 80 
40 7C 8E 00 40 00 38 00 00 00 01 00 00 10 00 10 
01 00 00 00 00 A8 80 80 40 7C 8E 00 40 00 38 00 
00 00 01 00 00 10 00 10
```

**Header**:  21 03 01 00 02 00 02 00

| Field       |      값 |
| ----------- | ----- |
| ID        | 0x21 |
| VERSION   | 0x03 |
| FLAG      |    1 |
| NSPRITEGp |    2 |
| NSEQUENCE |    2 |

이 ANM은 Sprite Group 2개, Sequence 2개를 가진다.

---

**Sequence**

1. Sequence 0:  00 00 00 00 00 00 00 00

    | Field     |   값 |
    | --------- | -- |
    | SprGpNo | 0 |
    | TIME    | 0 |
    | X       | 0 |
    | Y       | 0 |

2. Sequence 1: 01 00 00 00 00 00 00 00

    | Field     |   값 |
    | --------- | -- |
    | SprGpNo | 1 |
    | TIME    | 0 |
    | X       | 0 |
    | Y       | 0 |

즉 첫 번째 프레임은 Sprite Group 0번, 두 번째 프레임은 Sprite Group 1번을 사용한다.

---

**Sprite Group 0**:  01 00 00 00, NSprite = 1

Sprite Entry: 00 38 80 80 40 7C 8E 00 40 00 38 00 00 00 01 00 00 10 00 10

| Field    | Raw     |        값 |
| -------- | ------- | ------- |
| u      | 00    |      0 |
| v      | 38    |   0x38 |
| ofsX   | 80    |   0x80 |
| ofsY   | 80    |   0x80 |
| CBA    | 40 7C | 0x7C40 |
| FLAG   | 8E 00 | 0x008E |
| W      | 40 00 |     64 |
| H      | 38 00 |     56 |
| ROT    | 00 00 |      0 |
| FLAG2  | 01 00 |      1 |
| ScaleX | 00 10 | 0x1000 |
| ScaleY | 00 10 | 0x1000 |

---

**Sprite Group 1**: 01 00 00 00, NSprite = 1

Sprite Entry: 00 A8 80 80 40 7C 8E 00 40 00 38 00 00 00 01 00 00 10 00 10

| Field    | Raw     |        값 |
| -------- | ------- | ------- |
| u      | 00    |      0 |
| v      | A8    |   0xA8 |
| ofsX   | 80    |   0x80 |
| ofsY   | 80    |   0x80 |
| CBA    | 40 7C | 0x7C40 |
| FLAG   | 8E 00 | 0x008E |
| W      | 40 00 |     64 |
| H      | 38 00 |     56 |
| ROT    | 00 00 |      0 |
| FLAG2  | 01 00 |      1 |
| ScaleX | 00 10 | 0x1000 |
| ScaleY | 00 10 | 0x1000 |

이 예시는 Sprite Group 2개를 Sequence가 번갈아 참조하는 구조다.  Frame 0은 Group 0을 사용하고, TIM의 (0, 0x38) 위치에서 64 x 56 영역을 가져온다.  Frame 1은 Group 1을 사용하고, TIM의 (0, 0xA8) 위치에서 64 x 56 영역을 가져온다.  따라서 이 ANM은 2프레임 애니메이션으로 볼 수 있다.

---

## ANM 값이 실제 렌더링 패킷에 반영되는 과정

이제 ANM에서 확인한 값들이 실제 렌더링 코드에서 어떻게 사용되는지 확인해야한다. 스프라이트 출력에는 보통 GsSortSprite 또는 GsSortFastSprite 함수가 사용된다.

**GsSortFastSprite(sprite, ot, depth)**

- sprite는 a0, 렌더링에 사용할 sprite 데이터 주소

- ot / a1는 Ordering Table 정보

- depth / a2는 OT에 들어갈 depth 값

**어셈블리 코드**

```
TEXT:80060AF8 GsSortFastSprite:                        
TEXT:80060AF8                                          
TEXT:80060AF8                 move    $t3, $a0
TEXT:80060AFC                 move    $t5, $a1
TEXT:80060B00                 lw      $t4, 0($t3)
TEXT:80060B04                 nop
TEXT:80060B08                 bltz    $t4, locret_80060C6C
TEXT:80060B0C                 move    $t6, $a2
TEXT:80060B10                 lhu     $v0, 8($t3)
TEXT:80060B14                 nop
TEXT:80060B18                 beqz    $v0, locret_80060C6C
TEXT:80060B1C                 nop
TEXT:80060B20                 lhu     $v0, 0xA($t3)
TEXT:80060B24                 nop
TEXT:80060B28                 beqz    $v0, locret_80060C6C
TEXT:80060B2C                 lui     $a0, 0xE100
TEXT:80060B30                 li      $a0, 0xE1000200
TEXT:80060B34                 lui     $t2, 0xFF
TEXT:80060B38                 srl     $v0, $t4, 17
TEXT:80060B3C                 andi    $v0, 0x180
TEXT:80060B40                 or      $v0, $a0
TEXT:80060B44                 srl     $a0, $t4, 23
TEXT:80060B48                 andi    $a0, 0x60
TEXT:80060B4C                 li      $t2, 0xFFFFFF
TEXT:80060B50                 lhu     $v1, 0xC($t3)
TEXT:80060B54                 lw      $a3, dword_8009DC70
TEXT:80060B5C                 lhu     $a1, 6($t3)
TEXT:80060B60                 andi    $v1, 0x1F
TEXT:80060B64                 or      $v1, $v0
TEXT:80060B68                 or      $v1, $a0
TEXT:80060B6C                 lhu     $v0, 4($t3)
TEXT:80060B70                 and     $t2, $a3, $t2
TEXT:80060B74                 sw      $v1, 4($a3)
TEXT:80060B78                 lhu     $v1, word_8009DB6C
TEXT:80060B80                 lhu     $a0, word_8009DB6E
TEXT:80060B88                 lbu     $a2, 0x16($t3)
TEXT:80060B8C                 lbu     $t0, 0x15($t3)
TEXT:80060B90                 lbu     $t1, 0x14($t3)
TEXT:80060B94                 addu    $v0, $v1
TEXT:80060B98                 addu    $a1, $a0
TEXT:80060B9C                 andi    $v0, 0xFFFF
TEXT:80060BA0                 sll     $a1, 16
TEXT:80060BA4                 or      $v0, $a1
TEXT:80060BA8                 sw      $v0, 0xC($a3)
TEXT:80060BAC                 srl     $v0, $t4, 5
TEXT:80060BB0                 lui     $v1, 0x200
TEXT:80060BB4                 and     $v0, $v1
TEXT:80060BB8                 sll     $v1, $t4, 18
TEXT:80060BBC                 lui     $a0, 0x100
TEXT:80060BC0                 and     $v1, $a0
TEXT:80060BC4                 lui     $a0, 0x6400
TEXT:80060BC8                 or      $v1, $a0
TEXT:80060BCC                 or      $v0, $v1
TEXT:80060BD0                 sll     $a2, 16
TEXT:80060BD4                 or      $v0, $a2
TEXT:80060BD8                 sll     $t0, 8
TEXT:80060BDC                 or      $v0, $t0
TEXT:80060BE0                 or      $v0, $t1
TEXT:80060BE4                 sw      $v0, 8($a3)
TEXT:80060BE8                 lbu     $v1, 0xF($t3)
TEXT:80060BEC                 lbu     $v0, 0xE($t3)
TEXT:80060BF0                 lh      $a0, 0x12($t3)
TEXT:80060BF4                 sll     $v1, 8
TEXT:80060BF8                 or      $v0, $v1
TEXT:80060BFC                 sll     $a0, 22
TEXT:80060C00                 or      $v0, $a0
TEXT:80060C04                 lh      $v1, 0x10($t3)
TEXT:80060C08                 lui     $a0, 0x3F  # '?'
TEXT:80060C0C                 sll     $v1, 12
TEXT:80060C10                 and     $v1, $a0
TEXT:80060C14                 or      $v0, $v1
TEXT:80060C18                 sw      $v0, 0x10($a3)
TEXT:80060C1C                 lhu     $v0, 0xA($t3)
TEXT:80060C20                 lhu     $v1, 8($t3)
TEXT:80060C24                 sll     $v0, 16
TEXT:80060C28                 or      $v1, $v0
TEXT:80060C2C                 sw      $v1, 0x14($a3)
TEXT:80060C30                 andi    $v1, $t6, 0xFFFF
TEXT:80060C34                 sll     $v1, 2
TEXT:80060C38                 lw      $a0, 4($t5)
TEXT:80060C3C                 lw      $v0, 8($t5)
TEXT:80060C40                 addu    $a0, $v1
TEXT:80060C44                 sll     $v0, 2
TEXT:80060C48                 subu    $a0, $v0
TEXT:80060C4C                 lw      $v0, 0($a0)
TEXT:80060C50                 lui     $v1, 0x500
TEXT:80060C54                 addu    $v0, $v1
TEXT:80060C58                 sw      $v0, 0($a3)
TEXT:80060C5C                 addiu   $a3, 0x18
TEXT:80060C60                 sw      $t2, 0($a0)
TEXT:80060C64                 sw      $a3, dword_8009DC70
TEXT:80060C6C                 jr      $ra
TEXT:80060C70                 nop
```

아래는 hexray decompiler 후 이해를 돕기 위해 ai를 활용하여 GsSortFastSprite를 어셈블리 흐름에 맞춰 C 형태로 유사하게 옮긴 것이다.

```c
typedef uint8_t  u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef int16_t  s16;
typedef int32_t  s32;

#define MEM8(addr)   (*(u8  *)(uintptr_t)(addr))
#define MEM16(addr)  (*(u16 *)(uintptr_t)(addr))
#define MEM32(addr)  (*(u32 *)(uintptr_t)(addr))

extern u32 dword_8009DC70;
extern u16 word_8009DB6C;
extern u16 word_8009DB6E;

void GsSortFastSprite(u32 a0, u32 a1, u32 a2)
{
    u32 t3 = a0;
    u32 t5 = a1;
    u32 t6 = a2;
    u32 t4;
    u32 v0, v1;
    u32 a0r, a1r, a2r;
    u32 a3;
    u32 t0, t1, t2;

    t4 = MEM32(t3 + 0x00);

    if ((s32)t4 < 0)
        return;

    v0 = MEM16(t3 + 0x08);
    if (v0 == 0)
        return;

    v0 = MEM16(t3 + 0x0A);
    if (v0 == 0)
        return;

    a3 = dword_8009DC70;
    t2 = a3 & 0x00FFFFFF;
    a0r = 0xE1000200;
    v0 = t4 >> 17;
    v0 &= 0x180;
    v0 |= a0r;
    a0r = t4 >> 23;
    a0r &= 0x60;
    v1 = MEM16(t3 + 0x0C);
    v1 &= 0x1F;
    v1 |= v0;
    v1 |= a0r;
    MEM32(a3 + 0x04) = v1;
    a1r = MEM16(t3 + 0x06);
    v0  = MEM16(t3 + 0x04);
    v1  = word_8009DB6C;
    a0r = word_8009DB6E;
    v0  = v0 + v1;
    a1r = a1r + a0r;
    v0 &= 0xFFFF;
    a1r <<= 16;
    v0 |= a1r;
    MEM32(a3 + 0x0C) = v0;
    a2r = MEM8(t3 + 0x16);
    t0  = MEM8(t3 + 0x15);
    t1  = MEM8(t3 + 0x14);
    v0 = t4 >> 5;
    v0 &= 0x02000000;
    v1 = t4 << 18;
    v1 &= 0x01000000;
    v1 |= 0x64000000;
    v0 |= v1;
    v0 |= a2r << 16;
    v0 |= t0 << 8;
    v0 |= t1;
    MEM32(a3 + 0x08) = v0;
    v1  = MEM8(t3 + 0x0F);
    v0  = MEM8(t3 + 0x0E);
    a0r = (u32)(s16)MEM16(t3 + 0x12);
    v1 <<= 8;
    v0 |= v1;
    a0r <<= 22;
    v0 |= a0r;
    v1 = (u32)(s16)MEM16(t3 + 0x10);
    v1 <<= 12;
    v1 &= 0x003F0000;
    v0 |= v1;
    MEM32(a3 + 0x10) = v0;
    v0 = MEM16(t3 + 0x0A);
    v1 = MEM16(t3 + 0x08);
    v0 <<= 16;
    v1 |= v0;
    MEM32(a3 + 0x14) = v1;
    v1 = t6 & 0xFFFF;
    v1 <<= 2;
    a0r = MEM32(t5 + 0x04);
    v0  = MEM32(t5 + 0x08);
    a0r += v1;
    v0 <<= 2;
    a0r -= v0;
    v0 = MEM32(a0r + 0x00);
    v0 += 0x05000000;
    MEM32(a3 + 0x00) = v0;
    a3 += 0x18;
    MEM32(a0r + 0x00) = t2;
    dword_8009DC70 = a3;
}
```

## 예시 풀이 과정 

**사용될 예시 데이터**

```text
21 03 00 00 01 00 01 00 00 00 00 00 00 00 00 00
01 00 00 00 00 00 00 00 03 78 15 00 58 00 18 00
00 00 01 00 00 10 00 10
```

이번 예시의 ANM 좌표 값은 모두 0임을 알 수 있다.

- Sequence.X = 0
- Sequence.Y = 0
- ofsX = 0
- ofsY = 0

**ANM 기준 좌표 계산**

- ANM_X = Sequence.X + ofsX = 0 + 0 = 0
- ANM_Y = Sequence.Y + ofsY = 0 + 0 = 0

즉 이 ANM 자체는 출력 좌표에 추가 보정을 주지 않는다. 이후 게임 코드는 이 ANM 좌표에 게임 쪽 기준 좌표를 더해 렌더링용 sprite 좌표를 만든다.  그 결과 GsSortFastSprite 진입 시점의 a0 메모리는 다음 값을 가지고 있었다.

```
80060AF8  move  $t3, $a0
80060B5C  lhu   $a1, 6($t3)   ; Y = a0 + 0x06
80060B6C  lhu   $v0, 4($t3)   ; X = a0 + 0x04
```

즉 함수 안에서는 확인한 값들은 아래와 같으며, 이 값들 화면에 뿌려줄 이미지에 따라 다를 수 있다.

- X = 0xFFBC = -68
- Y = 0xFFEC = -20

여기에 전역 draw offset이 더해진다. 현재 확인된 전역 offset은 둘 다 0이다.

- word_8009DB6C = 0
- word_8009DB6E = 0

따라서 최종 좌표 계산은 다음과 같다.

- finalX = (Sequence.X + ofsX) + baseX + word_8009DB6C -> (0 + 0) + (-68) + 0 = -68 -> 0xFFBC
- finalY = (Sequence.Y + ofsY) + baseY + word_8009DB6E ->  (0 + 0) + (-20) + 0 = -20 -> 0xFFEC

GPU packet의 XY word는 Y를 상위 16비트, X를 하위 16비트에 넣는다.

```
80060B94  addu  $v0, $v1      ; X += word_8009DB6C
80060B98  addu  $a1, $a0      ; Y += word_8009DB6E
80060B9C  andi  $v0, 0xFFFF   ; X를 16비트로 정리
80060BA0  sll   $a1, 16       ; Y << 16
80060BA4  or    $v0, $a1      ; (Y << 16) | X
80060BA8  sw    $v0, 0xC($a3) ; GPU packet XY 저장
```

**최종 XY word**

XY = (finalY << 16) \| finalX -> XY = (0xFFEC << 16) \| 0xFFBC -> XY = 0xFFECFFBC

## 결론

여기서 한글화 작업에 필요한 주요 필드는 Sequence의 X, Y와 Sprite Entry의 u, v, ofsX, ofsY, W, H 정도다.

화면에 표시될 위치는 기본적으로 X + ofsX, Y + ofsY로 계산된다. 음수 좌표를 적용해야 할 경우에는 2바이트 signed 값인 X, Y를 수정하는 것이 적합하다.

TIM 이미지에서 가져올 위치와 크기를 조정하려면 u, v, W, H를 수정한다. 이미지 자체를 원하는 크기로 수정한 뒤, ANM의 u, v, W, H 값을 그에 맞게 맞춰주면 된다.


