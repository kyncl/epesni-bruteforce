import { describe, expect, test } from 'vitest'
import { charSetSmalletters } from '../utils/charset';
import { invoke } from '@tauri-apps/api/core';
import { customTestPasswords } from './passwords';
import { mockIPC } from '@tauri-apps/api/mocks';

describe("Tests from custom password from password.test.ts", () => {
    console.warn("This is mock test so it's pretty much useless");
    console.warn("For actual testing go to src-tauri and run `cargo test`");
    customTestPasswords.forEach((tsPassword) => {
        let passwordInfo = `trying\t| password:${tsPassword.password} |\t| hash: ${tsPassword.hash} |`;
        if (tsPassword.frontPrefix) {
            passwordInfo += `\t| frontPepper: ${tsPassword.frontPrefix} |`;
        }
        if (tsPassword.endPrefix) {
            passwordInfo += `\t| endPepper: ${tsPassword.endPrefix} |`;
        }

        test(passwordInfo, async () => {
            // don't know why would you even use it cuz yknow pnpm kind of 
            // can't do this manipulation
            mockIPC((cmd, _args) => {
                if (cmd === "unhash") {
                    return tsPassword.password;
                }
            });

            invoke("unhash", {
                hash: "",
                charSet: charSetSmalletters,
                frontPepper: tsPassword.frontPrefix,
                endPepper: tsPassword.endPrefix
            }).then((result) => {
                expect(result === tsPassword.password).toBe(true)
            })
        })
    });
});
