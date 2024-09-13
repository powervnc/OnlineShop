
const CATEGORIES=["Drawing", "Painting", "Craft", "Printmaking", "Sculpting"]
const validateSupply = (item) => {
  let message = [];
  if (item.priceSupply < 0) {
    message.push("Price supply cannot be negative");
  }
  const re = new RegExp("^[a-zA-Z]");
  if (!re.test(item.nameSupply)) {
    message.push("Supply name must start with an alphabetic character");
  }
  if(!CATEGORIES.includes(item.categorySupply))
    message.push("Invalid category. Must be either Drawing, Painting, Craft, Printmaking or Sculpting");
  return {
    valid: message.length === 0,
    message: message,
  };
};
const validateProducer = (item) => {
  const re = new RegExp("^[a-zA-Z]");
  if (!re.test(item.nameProducer)) {
    return false;
  }
  return true;
};

validate = {};
validate.validateSupply = validateSupply;
validate.validateProducer = validateProducer;
module.exports = validate;
