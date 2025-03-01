import { poseidonDecrypt, poseidonEncrypt } from "../src/poseidonCipher"
import { Nonce, PlainText } from "../src/types"
import { genEcdhSharedKey, genPublicKey, genRandomBabyJubValue } from "./utils"

describe("Poseidon Cipher", () => {
    const privateKey = genRandomBabyJubValue()
    const publicKey = genPublicKey(privateKey)
    const encryptionKey = genEcdhSharedKey(privateKey, publicKey)

    const plainText: PlainText<bigint> = [BigInt(0), BigInt(1)]
    const nonce: Nonce = BigInt(5)

    describe("poseidonEncrypt", () => {
        it("Should encrypt a ciphertext given a key and a nonce", () => {
            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
            expect(cipherText).toBeDefined()
            expect(cipherText.length).toBe(4)
        })
    })

    describe("poseidonDecrypt", () => {
        it("Should produce the correct plaintext given a ciphertext and key", () => {
            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
            const decryptedPlainText = poseidonDecrypt(cipherText, encryptionKey, nonce, plainText.length)
            expect(decryptedPlainText).toStrictEqual(plainText)
        })
        it("Should throw when given an invalid key and the plaintext length % 3 is 2", () => {
            const plainText: PlainText<bigint> = new Array(8).fill(BigInt(0))
            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)

            expect(() => poseidonDecrypt(cipherText, [BigInt(0), BigInt(0)], nonce, plainText.length)).toThrow(
                "The last element of the message must be 0"
            )
        })
        it("Should throw when given an invalid key and the plaintext length % 3 is 1", () => {
            const plainText: PlainText<bigint> = new Array(7).fill(BigInt(0))
            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)

            expect(() => poseidonDecrypt(cipherText, [BigInt(0), BigInt(0)], nonce, plainText.length)).toThrow(
                "The last element of the message must be 0"
            )
        })
    })
})
