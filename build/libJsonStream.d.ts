declare namespace org {
    namespace chickenbox {
        namespace json {
            class InputStream {
                private readonly reader;
                private propertyNames;
                constructor(reader: chickenbox.buffer.Reader);
                private _read();
                read(): any;
            }
            class OutputStream {
                private readonly output;
                private propertyNames;
                private propertyIndexLookup;
                private writer;
                constructor(output: chickenbox.buffer.Writer);
                private index(key);
                private _write(json);
                write(json: any): void;
            }
        }
    }
}
