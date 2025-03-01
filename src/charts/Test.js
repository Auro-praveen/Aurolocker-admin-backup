import React, { useState, useEffect } from "react";
import { Button, Link } from "@mui/material";

import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import "./test.css";
import { decryptAES, encryptAES } from "../GlobalVariable/GlobalModule";

const populationLimit = 277500;
const url =
  "https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json";

const Test = () => {
  const [oData, setOdata] = useState({});
  const [inputData, setInputData] = useState();

  const [countriesAbovePop, setcountriesAbovePop] = useState([]);

  const [data, setDate] = useState();

  useEffect(() => {
    // getValFunction(Number(0));

    // testFunction();
    testFunction1([100, 500, 600, 200, 300], 700);
  }, []);

  const testFunction = () => {
    const prices = [10, 20, 15, 25, 10];
    const totAmountToSpend = 100;

    // maximum items we can buy from the price index from the money we have

    let spendingAmount = 0;
    let count = 0;
    let spendingAmountList = [];

    let prevSpendingAmount = 0;
    let prevCount = 0;
    let prevSpendingAmountList = [];

    prices.sort();

    console.log(prices);

    if (prices.length > 0) {
      for (let i = 0; i < prices.length; i++) {
        for (let j = i; j < prices.length; j++) {
          if (spendingAmount + prices[j] <= totAmountToSpend) {
            if (j === prices.length) {
              for (let k = 0; k < i; k++) {
                count++;
                spendingAmount += prices[j];
                spendingAmountList.push(prices[j]);
              }
            } else {
              count++;
              spendingAmount += prices[j];
              spendingAmountList.push(prices[j]);
            }
          } else {
            break;
          }
        }

        console.log(i);
        console.log("Count : " + count);

        if (prevCount < count) {
          prevCount = count;
          prevSpendingAmount = spendingAmount;
          prevSpendingAmountList = spendingAmountList;
        }

        count = 0;
        spendingAmount = 0;
        spendingAmountList = [];
      }
    }

    if (prevCount === prices.length) {
      console.log(prevCount);
      console.log(prevSpendingAmount);
      console.log(prevSpendingAmountList);

      console.log("you can buy all the items : " + prevCount);
    } else if (prevCount > 0) {
      console.log(prevCount);
      console.log(prevSpendingAmount);
      console.log(prevSpendingAmountList);

      console.log("you can buy total : " + prevCount + " items");
    } else {
      console.log(prevCount);
      console.log(prevSpendingAmount);
      console.log(prevSpendingAmountList);

      console.log("you can't buy any items");
    }
  };

  const testFunction1 = (prices, totAmountToSpend) => {
    prices.sort((a, b) => a - b);

    let spendingAmount = 0;
    let count = 0;
    let spendingAmountList = [];

    for (let price of prices) {
      if (spendingAmount + price <= totAmountToSpend) {
        spendingAmount += price;
        count++;
        spendingAmountList.push(price);
      } else {
        break; // Stop if we can't afford the next item
      }
    }

    console.log(`Total items bought: ${count}`);
    console.log(`Total amount spent: ${spendingAmount}`);
    console.log(`Items bought: ${spendingAmountList}`);

    if (count === prices.length) {
      console.log(`You can buy all the items: ${count}`);
    } else if (count > 0) {
      console.log(`You can buy total: ${count} items`);
    } else {
      console.log("You can't buy any items");
    }
  };

  const getValFunction = (num) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOdata(data[Number(num)]);

        let countArr = [];
        let popltn = [];

        let currencyCodeSet = new Map();

        data.map((obj) => {
          if (obj.population >= populationLimit) {
            const countryCurrencies = obj.currencies;

            countryCurrencies.map((obj) => {
              if (currencyCodeSet.has(obj.code)) {
                currencyCodeSet.set(obj.code, 2);
              } else {
                currencyCodeSet.set(obj.code, 1);
              }
            });

            countArr.push(obj);
            popltn.push(obj.population);
          }
        });

        setcountriesAbovePop([...countArr]);
        currencyCodeSet.forEach((value, key) => {
          if (value === 1) {
            currencyCodeSet.delete(key);
          }
        });

        new Promise(() => {
          filterCountriesWithCommonCurrency(currencyCodeSet, countArr).then(
            (res) => {
              countriesOperation(res[0], res[1]);
              console.log(res);
            }
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // for filtering the countries and the population  for the countries with only single currency for there country
  // and there curreency not been shared by the other countries currency

  const filterCountriesWithCommonCurrency = async (
    repeatedCurrencyMap,
    countryArrToFilter
  ) => {
    const repeatedCurrency = new Map(repeatedCurrencyMap);

    const countriesFilterArr = [...countryArrToFilter];

    console.log(countriesFilterArr.length);

    let filteredArr = [];
    let populationFilter = [];

    for (let index = 0; index < countriesFilterArr.length; index++) {
      const currency = countriesFilterArr[index].currencies;

      if (currency.length === 1) {
        if (!repeatedCurrency.has(currency[0].code)) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      } else {
        if (
          !repeatedCurrency.has(currency[0].code) ||
          !repeatedCurrency.has(currency[1].code)
        ) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      }
    }

    // populationFilter.sort((a, b) => {
    //   return a - b;
    // });

    console.log(filteredArr.length);

    return [populationFilter, filteredArr];
  };

  const countriesOperation = (poplutationStat, countriesArr) => {
    let populationWiseSortedCountryArr = [];

    for (let i = 0; i < 20; i++) {
      for (let index = 0; index < countriesArr.length; index++) {
        if (countriesArr[index].population === poplutationStat[i]) {
          populationWiseSortedCountryArr.push(countriesArr[index]);
          console.log(countriesArr[index]);

          break;
        }
      }
    }

    // console.log(populationWiseSortedCountryArr);

    let distance = 0;
    let count = 0;
    for (
      let index = 0;
      index < populationWiseSortedCountryArr.length - 1;
      index++
    ) {
      count += 1;

      if (index === populationWiseSortedCountryArr.length - 1) {
        distance += haversine(
          populationWiseSortedCountryArr[index].latlng,
          populationWiseSortedCountryArr[0].latlng
        );
      } else {
        distance += haversine(
          populationWiseSortedCountryArr[index].latlng,
          populationWiseSortedCountryArr[index + 1].latlng
        );
      }
    }

    console.log(count);
    console.log(distance.toFixed(2));
  };

  // Haversine formula for calculating the difference between two points like two latitude and longitude points
  function haversine(coordinationArr1, coordinationArr2) {
    const lat1 = coordinationArr1[0];
    const lon1 = coordinationArr1[1];

    const lat2 = coordinationArr2[0];
    const lon2 = coordinationArr2[1];

    // console.log(lat1, lon1, lat2, lon2);

    const R = 6371;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // const distance = Number(R * c.toFixed(2));
    const distance = R * c;
    return Number(distance);
  }

  const checkNumer = () => {
    console.log(oData);
  };

  const securityOperations = (type) => {
    if (type === "ENCRYPT") {
      const obj = {
        name: "praveen",
        age: 27,
        place: "bengaluru",
      };
      const result = encryptAES(JSON.stringify(obj));
      if (result) {
        setDate(result);
      } else {
        setDate("");
      }

      console.log(result);
    } else {
      const result = decryptAES(data);
      JSON.parse(result);
      if (result) {
        setDate(result);
      } else {
        setDate("");
      }
      console.log(result);
    }
  };

  // ans = [132962.77,  149463.66, 158574.19]

  return (
    <>
      <div>
        {/* {oData} */}
        <input
          type="number"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />{" "}
        <br /> <br />
        <Button variant="contained" onClick={() => getValFunction(inputData)}>
          submit
        </Button>{" "}
        <br /> <br />
        <Button variant="contained" onClick={() => checkNumer()}>
          Test
        </Button>
      </div>

      <div>
        <Button
          variant="contained"
          onClick={() => securityOperations("ENCRYPT")}
        >
          enrypt
        </Button>
        <Button
          variant="contained"
          onClick={() => securityOperations("DECRYPT")}
        >
          decrypt
        </Button>
      </div>

      <div>
        <h2> data here </h2>
        <p> {data} </p>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="#last-page">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>

      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
      <div className="logo-contain" id="last-page">
        <div className="logos">
          <a href="https://in.bookmyshow.com/bengaluru/movies/ondu-sarala-premakathe/ET00384369">
            <TwitterIcon className="log" color="secondary" fontSize="large" />
          </a>

          <InstagramIcon className="log" color="secondary" fontSize="large" />
          <FacebookIcon className="log" color="secondary" fontSize="large" />
        </div>
      </div>
    </>
  );
};

export default Test;
