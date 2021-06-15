const axios = require('axios')
const moment = require('moment')

function orderAdmin(socket,notyf){
    const orderBody = document.querySelector('#orderBody')
    const order = []
    let markup

    axios.get('/admin/orders',{

        //ajax call req.xhr
        headers : {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res=>{
        orders = res.data 

        //console.log(orders)
        markup = generateMarkup(orders)
        orderBody.innerHTML = markup
    }).catch(err=>{
        console.log(err)
    })
    function orderItem(items){
        const arrayItem = Object.values(items)
        return arrayItem.map(orderItem=>{
            return `
                <p>${orderItem.itemDetails.item.name} - ${orderItem.itemDetails.Qty} pcs</p>
            `
        }).join('')
    }

    
    function generateMarkup(orders){
        return orders.map(order=>{
            return temMarkup = `
            <tr>
            <td class='border px-4 py-2 text-pink-500'>
                ${order._id}
            </td>
            <td class='border px-4 py-2'>
                ${orderItem(order.items)}
            </td>
            <td class='border px-4 py-2'>
                ${order.customerId.name}
            </td>
            <td class='border px-4 py-2'>
                ${order.customerId.address}
            </td>
            <td class='border px-4 py-2'>
                ${order.customerId.phone}
            </td>
            <td class='border px-4 py-2'>
                <div class="inline-block relative">
                    <form action="/admin/order/status-update" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()" class="bg-white border border-gray-400 px-4 py-2 rounded shadow">
                            <option value="Placed" ${order.status === 'Placed' ? 'selected' : ''} >Placed
                            </option>
                            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''} >Confirmed
                            </option>
                            <option value="Prepared" ${order.status === 'Prepared' ? 'selected' : ''} >Prepared
                            </option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''} >Delivered
                            </option>
                            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''} >Completed
                            </option>
                        </select>
                    </form>
                    
                </div>
            </td>
            <td class='border px-4 py-2'>
                ${moment(order.createdAt).format('DD MMM hh:mm A')}
            </td>
        </tr>
        `      
        }).join('')
        
    }
    socket.on('orderPlacedInAdmin',data=>{
        orders.unshift(data)
        orderBody.innerHTML = ''
        markup = generateMarkup(orders)
        orderBody.innerHTML = markup
        notyf.success("New Order Placed")
    })

}
module.exports = orderAdmin