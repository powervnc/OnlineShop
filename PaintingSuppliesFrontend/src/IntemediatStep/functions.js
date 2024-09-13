export const getAllProducers = async () => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const response = await fetch(
      "https://localhost:5000/api2/producer/getProducers",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `BEARER ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching producers:", error);
    return [];
  }
};

const getNrSuppliesProducedBy = async (nameProducer) => {
  try {
    const response = await fetch(
      "https://localhost:5000/api2/supply/nrSuppliesProduced",
      {
        method: "PATCH",
        body: JSON.stringify({
          producer: nameProducer,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization:
            "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error calculating the number of supplies producer by:",
      error
    );
    return 0;
  }
};

//from the app declare  const nextButton = document.getElementById("next-button");
//same from prveiousButoon

const initialzeNextButton = (nextButton, countSupplies) => {
  if (Math.ceil(countSupplies.count / 50) > 1) {
    console.log("next");
    nextButton.style.display = "block";
    nextButton.innerHTML = "next page";
  } else {
    nextButton.style.display = "none";
  }
};

//page must be 1 initailly, we will reusie this
const getPaginatedSupplies = async (nameProducer, page) => {
  try {
    const response = await fetch("https://localhost:5000/api2/supply/pages", {
      method: "PATCH",
      body: JSON.stringify({
        producer: nameProducer,
        page: page,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting the paginated supplies", error);
    return [];
  }
};

const addProducer = async (formData) => {
  const response = await fetch(
    "https://localhost:5000/api2/producer/addProducer",
    {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  if (response.status == 400) {
    throw new Error(response.message);
  }
  const result = await response.json();
  return result;
};

const updateSupply = async (formData, page) => {
  const response = await fetch("https://localhost:5000/api2/supply/api5", {
    method: "PATCH",
    body: JSON.stringify({
      ...formData,
      page: page,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization:
        "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
    },
  });
  if (!response.ok) {
    throw new Error("Supply data is not correct");
  }
};

const updateProducer = async (formData) => {
  const response = await fetch("https://localhost:5000/api2/supply/api5", {
    method: "PATCH",
    body: JSON.stringify({
      ...formData,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization:
        "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
    },
  });
  if (!response.ok) {
    throw new Error(response.message);
  } else {
    const result = await response.json();
    return result;
  }
};

