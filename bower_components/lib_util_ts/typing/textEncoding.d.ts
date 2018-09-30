declare class TextEncoder {
	constructor(encoding: string)
	encode( s: string): Uint8Array
}

declare class TextDecoder {
	constructor(encoding:string)
	decode(buffer: Uint8Array): string
}