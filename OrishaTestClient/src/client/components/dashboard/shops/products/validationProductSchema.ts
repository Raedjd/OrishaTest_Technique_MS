import * as Yup from "yup";

const toNumber = (value: number, originalValue: unknown) =>
    originalValue === "" || Number.isNaN(value) ? undefined : value;


export const validationProductSchema = Yup.object({
    ExpectedQuantity: Yup.number().required(),
    ReceivedQuantity: Yup.number()
        .transform(toNumber)
        .typeError("Received quantity must be a number")
        .required("Received quantity is required")
        .integer("Received quantity must be a whole number")
        .min(0, "Received quantity cannot be negative")
        .max(Yup.ref("ExpectedQuantity"), ({ max }) => `Received quantity cannot exceed the expected quantity (${max})`),
});

export type ProductFormValues = Yup.InferType<typeof validationProductSchema>;
