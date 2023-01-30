import mongoose from "mongoose";


export interface IOrder {
    order_number: number;
    owner_name: string;
    owner_phone: string;
    owner_email: string;
    total_price: number;
    promocode: string;
    discounted_price: number;
    shipping: string;
    shipping_adress: string;
    order_status: string;
    createdAt: Date;
    comment: string;
    order_details: [
        {
            textile_item: mongoose.Schema.Types.ObjectId;
            qty: number;
            print?: {
                front_print?: string;
                front_preview?: string;
                front_print_params?: string;
                back_print?: string;
                back_preview?: string;
                back_print_params?: string;
                lsleeve_print?: string;
                lsleeve_preview?: string;
                lsleeve_print_params?: string;
                rsleeve_print?: string;
                rsleeve_preview?: string;
                rsleeve_print_params?: string;
            };
        },
    ];
    isPayed: boolean;

}







const orderSchema = new mongoose.Schema<IOrder>({
    order_number: { type: Number, required: false},
    owner_name: { type: String, minlength: 2, maxlength: 40, required: false },
    owner_phone: { type: String, required: false },
    owner_email: { type: String, required: false },
    total_price: { type: Number, required: false },
    promocode: { type: String },
    discounted_price: { type: Number },
    shipping: { type: String, enum: ['Самовывоз из студии', 'Доставка по СПБ', 'Доставка по РФ'], required: false, default: 'Самовывоз из студии' },
    shipping_adress: { type: String },
    isPayed: { type: Boolean, default: false },
    order_status: { type: String, default: 'created' },
    createdAt: { type: Date, default: Date.now() },
    comment: { type: String},
    order_details: [
        {
            textile_item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
            },
            qty: {
              type: Number,
            },
            print: {
              front_print: { type: String },
              front_preview: { type: String },
              front_print_params: { type: String },
              back_print: { type: String },
              back_preview: { type: String },
              back_print_params: { type: String },
              lsleeve_print: { type: String },
              lsleeve_preview: { type: String },
              lsleeve_print_params: { type: String },
              rsleeve_print: { type: String },
              rsleeve_preview: { type: String },
              rsleeve_print_params: { type: String },
            },
        },
    ],

})



export default mongoose.model('order', orderSchema);



