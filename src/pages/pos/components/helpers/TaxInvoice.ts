import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Set vfs
pdfMake.vfs = pdfFonts.vfs;

export interface InvoiceCalc {
    unique_tax_components: { tax_component_id: number; tax_component_name: string }[];
    product_calcs: {
        id: number;
        name: string;
        sac: string;
        hsn: string;
        product_id: number;
        product_price_id: number;
        base: number;
        original_base: number;
        tax: number;
        taxable: number;
        total: number;
        discount: number;
        discount_percentage: number;
        quantity: number;
        taxes: { tax_component_id: number; tax_component_name: string; percentage: number; amount: number }[];
    }[];
    grouped_taxes: { tax_component_id: number; tax_component_name: string; percentage: number; value: number }[];
    order_totals: {
        base: number;
        original_base: number;
        tax: number;
        taxable: number;
        total: number;
        discount: number;
        discount_percentage: number;
    };
}

type Party = {
    id: number,
    name: string,
    gst_number: string,
    address: string,
    pincode: string
}
const to_num = (v: any) => Number(v || 0);

export function downloadInvoicePdf(calc: InvoiceCalc, data: {
    currency_symbol: string,
    billto: Party,
    seller: Party,
    shipto: Party
}, filename: string = 'invoice.pdf') {
    const formatMoney = (amount: number) => `${data.currency_symbol}${amount.toFixed(2)}`;

    const sellerStack = [
        { text: 'Seller:', bold: true, margin: [0, 0, 0, 5] },
        { text: data.seller.name, bold: true, fontSize: 14 },
        { text: data.seller.address },
        { text: `PIN: ${data.seller.pincode}` },
        { text: `GST: ${data.seller.gst_number}`, margin: [0, 10, 0, 0] }
    ];

    const billToStack = [
        { text: 'Bill To:', bold: true, margin: [0, 0, 0, 5] },
        { text: data.billto.name, bold: true },
        { text: data.billto.address },
        { text: `PIN: ${data.billto.pincode}` },
        { text: `GST: ${data.billto.gst_number}` }
    ];

    const shipToStack = [
        { text: 'Ship To:', bold: true, margin: [0, 0, 0, 5] },
        { text: data.shipto.name, bold: true },
        { text: data.shipto.address },
        { text: `PIN: ${data.shipto.pincode}` },
        { text: `GST: ${data.shipto.gst_number}` }
    ];

    const productsTableBody = [
        [
            { text: 'Description', style: 'tableHeader' },
            { text: 'Qty', style: 'tableHeader' },
            { text: 'Rate', style: 'tableHeader' },
            { text: 'Amount', style: 'tableHeader' },
            { text: 'Discount', style: 'tableHeader' },
            { text: 'Tax', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader' }
        ],
        ...calc.product_calcs.map(pc => [
            {
                stack: [
                    { text: pc.name, bold: true },
                    { text: `HSN: ${pc.hsn} | SAC: ${pc.sac}`, fontSize: 8, italics: true }
                ],
                margin: [0, 0, 0, 5]
            },
            { text: pc.quantity.toString(), alignment: 'center' },
            { text: formatMoney(pc.original_base / pc.quantity), alignment: 'right' },
            { text: formatMoney(pc.original_base), alignment: 'right' },
            { text: `-${formatMoney(pc.discount)}\n(${pc.discount_percentage.toFixed(2)}%)`, alignment: 'right', fontSize: 8 },
            { text: formatMoney(pc.tax), alignment: 'right' },
            { text: formatMoney(pc.total), alignment: 'right', bold: true }
        ])
    ];

    const taxesTableBody = [
        [
            { text: 'Tax Description', style: 'tableHeader' },
            { text: 'Rate (%)', style: 'tableHeader' },
            { text: 'Amount', style: 'tableHeader' }
        ],
        ...calc.grouped_taxes.map(gt => [
            { text: gt.tax_component_name },
            { text: gt.percentage.toFixed(2), alignment: 'center' },
            { text: formatMoney(gt.value), alignment: 'right' }
        ])
    ];

    const totalsTableBody = [
        [
            { text: 'Description', style: 'totalsHeader' },
            { text: 'Amount', style: 'totalsHeader' }
        ],
        [
            { text: 'Subtotal' },
            { text: formatMoney(calc.order_totals.original_base), alignment: 'right' }
        ],
        [
            { text: 'Discount' },
            { text: `-${formatMoney(calc.order_totals.discount)} (${calc.order_totals.discount_percentage.toFixed(2)}%)`, alignment: 'right', italics: true }
        ],
        [
            { text: 'Taxable Value' },
            { text: formatMoney(calc.order_totals.base), alignment: 'right' }
        ],
        [
            { text: 'Tax' },
            { text: formatMoney(calc.order_totals.tax), alignment: 'right' }
        ],
        [
            { text: 'Total', bold: true, margin: [0, 5, 0, 0] },
            { text: formatMoney(calc.order_totals.total), alignment: 'right', bold: true, fontSize: 14 }
        ]
    ];

    const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [40, 60, 40, 40],
        content: [
            // Invoice Header
            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            { text: 'INVOICE', style: 'header', alignment: 'left' },
                            { text: `Date: ${new Date().toLocaleDateString()}`, fontSize: 10, margin: [0, 5, 0, 0] }
                        ]
                    },
                    {
                        width: '*',
                        alignment: 'right',
                        stack: [
                            { text: `Invoice No: INV-${Date.now().toString().slice(-6)}`, fontSize: 10 }
                        ]
                    }
                ],
                margin: [0, 0, 0, 20]
            },
            // Seller Information (highlighted)
            {
                stack: sellerStack,
                margin: [0, 0, 0, 20]
            },
            // Bill To and Ship To in a box
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [billToStack, shipToStack]
                    ],
                    layout: {
                        hLineWidth: () => 1,
                        vLineWidth: () => 1,
                        hLineColor: () => '#000',
                        vLineColor: () => '#000'
                    }
                },
                margin: [0, 0, 0, 20]
            },
            // Products Table
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: productsTableBody,
                    layout: {
                        fillColor: function (rowIndex: number) {
                            return rowIndex === 0 ? '#CCCCCC' : null;
                        },
                        hLineWidth: function (i: number, node: any) {
                            return i === 0 || i === node.table.body.length ? 1 : 0.5;
                        },
                        vLineWidth: function (i: number, node: any) {
                            return 0.5;
                        },
                        hLineColor: function (i: number, node: any) {
                            return '#CCCCCC';
                        },
                        vLineColor: function (i: number, node: any) {
                            return '#CCCCCC';
                        }
                    }
                },
                margin: [0, 0, 0, 20],
                layout: 'lightHorizontalLines'
            },
            // Taxes Table
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto'],
                    body: taxesTableBody,
                    layout: 'lightHorizontalLines'
                },
                margin: [0, 0, 0, 20]
            },
            // Totals Table
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: totalsTableBody,
                    layout: {
                        fillColor: function (rowIndex: number) {
                            return rowIndex === 0 ? '#CCCCCC' : null;
                        },
                        hLineWidth: function (i: number, node: any) {
                            return 1;
                        },
                        vLineWidth: function (i: number, node: any) {
                            return i === 0 || i === 1 ? 1 : 0;
                        },
                        hLineColor: function (i: number, node: any) {
                            return '#000000';
                        },
                        vLineColor: function (i: number, node: any) {
                            return i === 0 || i === 1 ? '#000000' : null;
                        }
                    }
                },
                margin: [0, 0, 0, 0],
                columnStyles: {
                    0: { alignment: 'left' },
                    1: { alignment: 'right' }
                }
            }
        ],
        styles: {
            header: {
                fontSize: 24,
                bold: true,
                color: '#333'
            },
            tableHeader: {
                bold: true,
                fontSize: 11,
                color: '#333',
                fillColor: '#CCCCCC'
            },
            totalsHeader: {
                bold: true,
                fontSize: 11,
                color: '#333',
                fillColor: '#E6E6E6'
            }
        },
        defaultStyle: {
            fontSize: 10,
            alignment: 'left'
        }
    };

    pdfMake.createPdf(docDefinition).download(filename);
}