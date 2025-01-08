import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { json } from 'react-router-dom';
import PathUrl from "../GlobalVariable/urlPath.json";
import LockerCatagoryTable from '../settingsComponent/TableFunction/LockerCatagoryTable';
import { useAuth } from '../utils/Auth';

const LossedCustomers = () => {
    
    const [lossedCustomersObj, setLossedCustomersObj] = useState({
      slno:"",
      mobileNo:"",
      customerName:"",
      dateofOpen:"",
      timeofOpen:"",
      terminalId:"",
      noOfHours:"",
      amount:"",
      status:"",
      closingData:"",
      closingTime:"",
      lockerNo:"",
      Passcode:""

    })
    const [isDateWrong, setIsDateWrong] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        getAllLossedCustomers(currentDate());
    }, [])

    const Auth = useAuth()

    const getAllLossedCustomers = (date) => {
        const reqObj = {
            PacketType:"lossedcust",
            date: date
        }

        fetch(Auth.serverPaths.localAdminPath+"FetchLossedCustomers", {
            method:"POST",
            headers: {
                accept: "application/json",
              },
            body: JSON.stringify(reqObj)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.slno.length > 0) {
                setLossedCustomersObj({
                  slno:data.slno,
                  mobileNo:data.MobileNo,
                  customerName:data.customerName,
                  dateofOpen:data.dateOfOpen,
                  timeofOpen:data.timeOfOpen,
                  terminalId:data.terminalId,
                  noOfHours:data.noOfHours,
                  amount:data.amount,
                  status:data.status,
                  closingData:data.closingTime,
                  closingTime:data.closingDate,
                  lockerNo:data.lockerNo,
                  Passcode:data.Passcode
                })
            } else {
              setLossedCustomersObj({
                ...lossedCustomersObj,
                slno:"",
                mobileNo:"",
                customerName:"",
                dateofOpen:"",
                timeofOpen:"",
                terminalId:"",
                noOfHours:"",
                amount:"",
                status:"",
                closingData:"",
                closingTime:"",
                lockerNo:"",
                Passcode:""
              })
            }
        })
        .catch(err => {
            console.log("err :"+err)
        })
    }

    const currentDate = () => {
        const date = new Date();
        let alteredMonth = String(date.getMonth()+1);
        let alteredDay = String(date.getDate());
        if (alteredMonth.length == 1) {
          alteredMonth = 0+alteredMonth;
        }
        if (alteredDay == 1 ) {
          alteredDay = 0+alteredDay;
        }

        setSelectedDate(date.getFullYear()+"-"+alteredMonth+"-"+alteredDay)
        
        return date.getFullYear()+"-"+String(date.getMonth()+1)+"-"+date.getDate();
    }

    const onChangeSelectedDate = (e) => {
        const selecteDate = e.target.value;
        // alert(selecteDate)
        setSelectedDate(selecteDate);
    
        console.log(selecteDate);
        const isSelectedDateOk = verifyDate(selecteDate);
    
        if (isSelectedDateOk) {
          setIsDateWrong(false);
          getAllLossedCustomers(
            selecteDate
          );
        } else {
          setIsDateWrong(true);
        }
      };

      const verifyDate = (selectedDate) => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        const currentDate = yyyy + "-" + mm + "-" + dd;
    
        if (selectedDate <= currentDate) {
          console.log(true);
          return true;
        } else {
          console.log(false);
          return false;
        }
      };

  return (
    <div className='lossed-customer-component'>
        <div className="page-header">
            <h2 className='page-title'>Lossed Customers</h2>
        </div>
        
        <div className="mui-mobile-date-picker">
            <TextField
              label="select date to view TD history"
              type="date"
              variant="standard"
              inputFormat="MM/DD/YYYY"
              error={isDateWrong}
              color="info"
              value={selectedDate}
              onChange={(e) => onChangeSelectedDate(e)}
              helperText={isDateWrong ? "Please Choose Valid date" : ""}
              focused
              fullWidth
            />
          </div>

        {
            lossedCustomersObj.slno
            ?
            <LockerCatagoryTable
                tableData={lossedCustomersObj}
                tableType={"lossedCustomers"}
          />
          :
          <p>No Lossed Customers on selected Date</p>
        }
    </div>
  )
}

export default LossedCustomers;