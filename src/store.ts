import {initDb} from './query/init'

const state = {
    invoices : [],
    form: {
        id: 0,
        name: '',
        phone: '',
        date: '2023/04/02',
        total: 0
    },
    formUnit: [
        {orderNo: 1, aName: '', quantity: 1, price:null},
        {orderNo: 2, aName: '', quantity: 1, price:null},
        {orderNo: 3, aName: '', quantity: 1, price:null},
    ],
}
const getters = {
    getInvoices(state:any) {
        return state.invoices
    },
    getForm(state:any) {
        return state.form;
    },
    getFormUnit(state:any) {
        return state.formUnit;
    }
}
const mutations = {
    setInvoices(state:any, payload:any) {
        state.invoices = payload.values
    },
    setFormInvoices(state:any, payload:any) {
        state.form.name = payload[0].main.aName
        state.form.phone = payload[0].main.userNumber
        state.form.date = payload[0].main.dateG
        state.form.total = payload[0].main.amountPayed

        state.formUnit = payload[1].units  
    },
    addUnit(state:any, payload:any) {
        state.formUnit.push(payload)
    },
    clearData(state:any) {
        state.formUnit = [
            {orderNo: 1, aName: '', quantity: 1, price:null},
            {orderNo: 2, aName: '', quantity: 1, price:null},
            {orderNo: 3, aName: '', quantity: 1, price:null},
        ];
    },
    zeroData(state:any) {
        state.formUnit = [];
    },
    updateUnit(state:any, payload:any) {
        state.formUnit = payload
    }
}
const actions = {
    async getInvoices({commit}:any) {
        try {
            const init:any = await initDb();
            const res = await init.db?.query(
              "SELECT * FROM InvoiceSell ORDER BY invoiceNo DESC;"
            )
            commit('setInvoices', res)
            // await init.sqlite.closeConnection("NoEncryption");
            return true
          }
          catch(e) {
            console.log('error get invoices ', e)
            return alert('error select invoice ')
          }
    },
    async getInvoice({commit}:any, payload:number) {
        try {
            const init:any = await initDb();
            const res:any = await init.db?.query("SELECT * FROM InvoiceSell WHERE invoiceNo=?;", [payload])
            const pay:any = [{main: res.values[0]}]
            const resItems = await init.db?.query("SELECT * FROM InvoiceSellUnit WHERE invoiceNo=?;", [payload])
            pay.push({units: resItems.values})
            await commit('setFormInvoices', pay)
            return true
          }
          catch(e) {
            console.log('error details ', e)
            return alert('error select details')
          }
    },
    async updateInvoice({commit, state}:any, payload:any) {
        interface Unit {
            orderNo:number;
            quantity:any;
            price:any;
            aName:string;
          }
        try {
          const date = '2023/04/13';
          const init:any = await initDb();
            const res = await init.db?.query(
              "UPDATE InvoiceSell SET aName=?, userNumber=?, amountPayed=? WHERE invoiceNo=?;", [payload.form.value.name, payload.form.value.phone, payload.form.value.total ,payload.id]
            )
            // commit('zeroData')
            const newData:any[] = []
            await payload.units.forEach(async (item:Unit) => {
                const exist = await init.db?.query('SELECT * FROM InvoiceSellUnit WHERE orderNo=?', [item.orderNo]);
                if(exist.values.length) {
                    const sellUnit = await init.db?.query(
                        "UPDATE InvoiceSellUnit SET aName=?, quantity=?, price=? WHERE orderNo=?;", [item.aName, parseInt(item.quantity), parseInt(item.price) ,item.orderNo]
                    )
                    newData.push(item)
                }
                else {
                    if(item.aName != '' && item.price != '' && item.quantity != '') {
                        const sellUnit = await init.db?.query("INSERT INTO InvoiceSellUnit (orderNo, invoiceNo, aName, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)", [item.orderNo, payload.id, item.aName, parseInt(item.quantity), parseInt(item.price), parseInt(item.quantity)*parseInt(item.price)])
                        newData.push(item)
                    }
                } 
            })
            console.log({newData})
            await commit('updateUnit', newData)
            return true;
        }
        catch(e) {
          alert('error update details')
          console.log('error updatae ', e)
          return false;
        }
    },
    async getLastId({commit}:any) {
        try {
            const init:any = await initDb();
            const res:any = await init.db?.query("SELECT * FROM InvoiceSellUnit ORDER BY orderNo DESC LIMIT 1;")

            return res;
          }
          catch(e) {
            console.log('error details ', e)
            return alert('error select details')
          }
    }
}
export default {
    namespace: true,
    state,
    getters,
	mutations,
	actions
}