export interface ButtonInfo {
    label: string,
    value: string,
    style: string
}

export interface dialogConfig {
    message: string;
    title: string;
    button: ButtonInfo[];
}