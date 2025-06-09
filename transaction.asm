.MODEL SMALL
.STACK 100H
.DATA
HASH_DATA DB 20H, 0F5H, 86H, 47H, 4BH, 92H, 2DH, 42H, 0BBH, 8CH, 51H, 39H, 0BFH, 0B8H, 22H, 4DH
EXPECTED_HASH DB 20H, 0F5H, 86H, 47H, 4BH, 92H, 2DH, 42H, 0BBH, 8CH, 51H, 39H, 0BFH, 0B8H, 22H, 4DH
TRANSACTION_AMOUNT DW 4E20H  ; Amount in Hex (20000000 decimal)

.CODE
MAIN PROC
    MOV SI, OFFSET HASH_DATA     ; Load transaction hash
    MOV AL, [SI]                 ; Read first byte
    MOV BL, [SI+1]               ; Read second byte
    MOV CL, [SI+2]               ; Read third byte

    CMP AL, [EXPECTED_HASH]      ; Validate first byte
    JNZ INVALID_TRANSACTION
    CMP BL, [EXPECTED_HASH+1]    ; Validate second byte
    JNZ INVALID_TRANSACTION
    CMP CL, [EXPECTED_HASH+2]    ; Validate third byte
    JNZ INVALID_TRANSACTION

    MOV AX, TRANSACTION_AMOUNT   ; Load amount
    CALL EXECUTE_TRANSACTION     ; Execute validated transaction

    JMP EXIT

INVALID_TRANSACTION:
    MOV DX, OFFSET ERR_MSG
    MOV AH, 09H
    INT 21H                      ; Display error

EXIT:
    MOV AX, 4C00H
    INT 21H                      ; End program

EXECUTE_TRANSACTION PROC
    MOV DX, TRANSACTION_AMOUNT   ; Load transaction memory address
    MOV AX, TRANSACTION_AMOUNT   ; Load amount
    OUT DX, AX                   ; Send transaction for execution
    RET
EXECUTE_TRANSACTION ENDP

MAIN ENDP
END MAIN

