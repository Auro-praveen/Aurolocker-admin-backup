import React, { useState, useEffect } from "react";
import { Button, Link } from "@mui/material";

import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

import "./test.css";

const populationLimit = 277500;
const url =
  "https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json";

const Test = () => {
  const [oData, setOdata] = useState({});
  const [inputData, setInputData] = useState();

  const [countriesAbovePop, setcountriesAbovePop] = useState([]);

  useEffect(() => {
    getValFunction(Number(0));
  }, []);

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
