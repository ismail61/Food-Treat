const Btn = document.querySelectorAll(".cart_add")
const statusBtn = document.querySelectorAll(".status")
const updateStatusBtn = document.querySelector("#orderInput")
const cartQty = document.querySelector(".cartQty")
const timeTag = document.createElement('small')
const orderAdmin = require('./admin')
const Order = require('../../app/models/order')
var Emitter = require('events')
var eventEmitter = new Emitter()
const io = require("socket.io-client")
const moment = require('moment')
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
let notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      type: "success",
      background: "#4F8A10",
      duration: 2000,
      ripple : true
    },
    {
      type: "error",
      background: "indianred",
      duration: 2000,
      dismissible: true,
    },
  ],
});


const axios = require('axios')
var socket = io.connect('http://localhost:4444',{reconnection:false});

function updateCart(items) {
  axios.post("/update-cart", items).then((res) => {

        cartQty.innerText = res.data.totalQty
        notyf.success("Inserted cart successful")

    })
}

Btn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //console.log(e)
    const items = JSON.parse(btn.dataset.item);
    //console.log(items)
    updateCart(items);
  })
})


const order = updateStatusBtn ? JSON.parse(updateStatusBtn.value) : null

function updateStatus(order){
  statusBtn.forEach(status=>{
    status.classList.remove('completed')
    status.classList.remove('new')
  })
  let completedOrder = true
  statusBtn.forEach(status=>{
    const dataStatus = status.dataset.status
    if(completedOrder){
      status.classList.add('completed')
    }
    if(dataStatus === order.status){
      
      
      if(status.nextElementSibling){
        timeTag.innerHTML = moment(order.updatedAt).format('hh:mm A')
        status.appendChild(timeTag)
        status.nextElementSibling.classList.add('new')  
      }
      completedOrder = false
    }
  })
}

if(order){
  updateStatus(order)
}


//socket implement
//var socket = io();


const updateOrder = order
//socket.emit("hello", updateOrder._id);
//join or emit
if(updateOrder){
  //
  socket.emit('order',updateOrder._id)
}


//url check admin
const adminUrl = window.location.pathname
if(adminUrl.includes('admin')){
  
  orderAdmin(socket,notyf)
  productAdmin(notyfy)
  socket.emit('adminJoin','adminRoom')
}

socket.on('againOrderUpdated',data=>{
  //copy  order 
  const order = { ...updateOrder }
  order.updatedAt = moment().format()//current date
  order.status = data.status
  updateStatus(order)
  notyf.success(`Order ${order.status}`)
  
})
  

