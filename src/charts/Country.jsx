import React, { useState, useEffect } from "react";
// import { Button } from "@mui/material";

const populationLimit = 28875;
const url =
  "https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json";

const Country = () => {

    const testingHere = () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8]

        console.log(arr);
        
        const somethingToFilter = {
            test : "one"
        };


        const updatedArr = arr.filter(someCallBackFun, somethingToFilter);

        console.log(updatedArr);
    }

    const someCallBackFun = (currentVal) => {

        console.log("------");
        console.log(this.currentVal);
        // console.log(index);
        // console.log(Arr);

        // console.log(this.test);
        console.log("------");
        // if (currentVal > 4) {
        //     return 5;
        // }

    }


  useEffect(() => {
    // getValFunction();

    testingHere()

  }, []);

  const getValFunction = () => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // setOdata(data[Number(num)]);

        let countArr = [];

        let currencyCodeSet = new Map();

        data.map((obj) => {
          if (Number(obj.population) >= populationLimit) {
            const countryCurrencies = obj.currencies;

            countryCurrencies.map((obj) => {
              if (currencyCodeSet.has(obj.code)) {
                currencyCodeSet.set(obj.code, 2);
              } else {
                currencyCodeSet.set(obj.code, 1);
              }
            });
            countArr.push(obj);
          }
        });

        currencyCodeSet.delete("(none)");

        currencyCodeSet.forEach((value, key) => {
          if (value === 2) {
            currencyCodeSet.delete(key);
          }
        });

        console.log(currencyCodeSet);

        new Promise(() => {
          filterCountriesWithCommonCurrency(currencyCodeSet, countArr)
            .then((res) => {
              console.log(res);
              countriesOperation(res[0], res[1]);
            })
            .catch((err) => console.log("error : " + err));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // filtering the countries that didnt have any any exclusive currency for themselves

  const filterCountriesWithCommonCurrency = async (
    repeatedCurrencyMap,
    countryArrToFilter
  ) => {
    const repeatedCurrency = new Map(repeatedCurrencyMap);  // countries with same currency exclusivly for them

    const countriesFilterArr = [...countryArrToFilter];

    console.log(countriesFilterArr.length);

    let filteredArr = [];
    let populationFilter = [];

    for (let index = 0; index < countriesFilterArr.length; index++) {
      const currency = countriesFilterArr[index].currencies;

      if (currency.length === 1) {
        if (repeatedCurrency.has(currency[0].code)) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      } else {
        if (
          repeatedCurrency.has(currency[0].code) ||
          repeatedCurrency.has(currency[1].code)
        ) {
          filteredArr.push(countriesFilterArr[index]);
          populationFilter.push(countriesFilterArr[index].population);
        }
      }
    }

    // sorting population in ascending order

    // populationFilter.sort((a, b) => {
    //   return a - b;
    // });

    console.log(" filtered aray length :: - " + filteredArr.length);

    return [populationFilter, filteredArr];
  };

  const countriesOperation = (poplutationStat, countriesArr) => {
    let populationWiseSortedCountryArr = [];

    for (let i = 0; i < 20; i++) {
      for (let index = 0; index < countriesArr.length; index++) {
        if (countriesArr[index].population === poplutationStat[i]) {
          populationWiseSortedCountryArr.push(countriesArr[index]);
          //   console.log(countriesArr[index]);

          //   console.log(
          //     countriesArr[index].name + "===" + poplutationStat[i]
          //   );

          break;
        }
      }
    }

    console.log(populationWiseSortedCountryArr);

    let distance = 0;
    let count = 0;
    for (
      let index = 0;
      index < populationWiseSortedCountryArr.length - 1;
      index++
    ) {
      count += 1;

      // Just to Check :- finding the distance between last country and the first, just to check if in case it worksp

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
    const distance = Number(R * c.toFixed(2));
    // const distance = R * c;
    return Number(distance);
  }

  return <div>Country</div>;
};

export default Country;
