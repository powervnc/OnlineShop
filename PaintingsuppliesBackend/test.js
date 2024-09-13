const request = require('supertest');
const app = require('./server'); 

//console.log(app)
const { faker } = require('@faker-js/faker');




describe('CRUD Functionality', () => {
  let newSupplyId;

  it('should create a new supply when POST /api2 is called', async () => {
    const newSupplyData = {
      name: 'Test Supply',
      producer: 'Test Producer',
      price: 10,
      description: 'Test Description'
    };

    const response = await request(app)
      .post('/api2')
      .send(newSupplyData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
    const addedSupply = response.body.find(supply => supply.name === newSupplyData.name);
    expect(addedSupply).toBeDefined();
    newSupplyId = addedSupply.id;
  });
  it('should return an error message when POST /api2 is called with invalid data', async () => {
    const invalidSupplyData = {
      name: 'Invalid Supply',
      producer: 'Invalid Producer',
      price: -10,  
      description: 'Invalid Description'
    };

    const response = await request(app)
      .post('/api2')
      .send(invalidSupplyData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Supply data is wrong');
  });
  it('should return a list of supplies when GET /api1 is called', async () => {
    const response = await request(app).get('/api1');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some(supply => supply.id === newSupplyId)).toBe(true);
  });

  it('should return a specific supply when GET /api3/:id is called', async () => {
    const response = await request(app).get(`/api3?id=${newSupplyId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', newSupplyId);
  });

  it('should return a specific supply when GET /api3/:id is called', async () => {
    const response = await request(app).get(`/api3?id=${newSupplyId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', newSupplyId);
  });

 
  it('should update a supply when PATCH /api5 is called', async () => {
    const updatedSupplyData = {
      id: newSupplyId,
      name: 'Updated Supply',
      producer: 'Updated Producer',
      price: 20,
      description: 'Updated Description'
    };
    const response = await request(app)
      .patch('/api5')
      .send(updatedSupplyData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
    const updatedSupply = response.body.find(supply => supply.id === newSupplyId);
    expect(updatedSupply).toBeDefined();
    expect(updatedSupply).toMatchObject(updatedSupplyData);
  });
  it('should return an error message when PATCH /api5 is called with invalid data', async () => {
    const invalidUpdateData = {
      id: 1, 
      name: 'Invalid Updated Supply',
      producer: 'Invalid Updated Producer',
      price: -10, 
      description: 'Invalid Updated Description'
    };

    const response = await request(app)
      .patch('/api5')
      .send(invalidUpdateData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Supply data wrong');
  });

  it('should delete a supply when DELETE /api4 is called', async () => {
    const response = await request(app)
      .delete('/api4')
      .send({ id: newSupplyId });

    expect(response.statusCode).toBe(200);
    
    expect(response.body.some(supply => supply.id === newSupplyId)).toBe(false);
  });

    it('should return an object with id, name, producer, and price properties', () => {
      const randomSupply =  {
        id:1000,
        name:faker.commerce.productName(),
        producer:faker.commerce.productName(),
        price: faker.number.int({ min: 5, max: 100 })
    }
      expect(randomSupply).toHaveProperty('id');
      expect(randomSupply).toHaveProperty('name');
      expect(randomSupply).toHaveProperty('producer');
      expect(randomSupply).toHaveProperty('price');
    });
  
});

