const amountElement = document.getElementById("amount")

paypal
    .Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase: [
                    {
                        amount: {
                            value: amountElement.value,
                        }
                    }
                ]
            })
        },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            alert("Transaction completed by " + details.payer.name.given_name)
        })
    }
})
    .render("#paypal")
    