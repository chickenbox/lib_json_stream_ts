declare namespace org {
    namespace chox {
        namespace json {
            class InputStream {
                private propertyNames;
                private _read(reader);
                read(buffer: ArrayBuffer): any;
            }
            class OutputStream {
                private propertyNames;
                private propertyIndexLookup;
                private writer;
                private headerWriter;
                private index(key);
                private _write(json);
                write(json: any): ArrayBuffer;
            }
        }
    }
}
