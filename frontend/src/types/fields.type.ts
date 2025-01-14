export type FieldsType = {
        name: string,
        id: string,
        element: HTMLInputElement| null,
        regex: RegExp,
        valid: boolean,
        wasChanged: boolean
}