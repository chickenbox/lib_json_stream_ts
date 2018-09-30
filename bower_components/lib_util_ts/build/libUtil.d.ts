declare namespace org {
    namespace chickenbox {
        namespace buffer {
            class Reader {
                private readonly buffer;
                private dataView;
                private offset;
                private textDecoder;
                constructor(buffer: ArrayBuffer, stringEncoding?: string);
                readonly int8: number;
                readonly uint8: number;
                readonly int16: number;
                readonly int32: number;
                readonly float32: number;
                readonly float64: number;
                readonly bool: boolean;
                readonly bytes: ArrayBuffer;
                readonly string: string;
                readonly tinyString: string;
            }
        }
    }
}
declare namespace org {
    namespace chickenbox {
        namespace buffer {
            class Util {
                static readFrom(url: string, completion: (buffer?: ArrayBuffer, lastModified?: Date) => void): void;
            }
        }
    }
}
declare namespace org {
    namespace chickenbox {
        namespace buffer {
            class Writer {
                private _buffer;
                private dataView;
                private _offset;
                private textEncoder;
                readonly buffer: ArrayBuffer;
                readonly length: number;
                constructor(initialBufferSize?: number, stringEncoding?: string);
                private resize(size);
                private enlargeBy(size);
                reset(): void;
                writeInt8(i: number): void;
                writeUint8(i: number): void;
                writeInt16(i: number): void;
                writeInt32(i: number): void;
                writeFloat32(f: number): void;
                writeFloat64(f: number): void;
                writeBool(b: boolean): void;
                writeBytes(bytes: Uint8Array, writeLen?: boolean): void;
                writeTinyString(s: string): void;
                writeString(s: string): void;
            }
        }
    }
}
