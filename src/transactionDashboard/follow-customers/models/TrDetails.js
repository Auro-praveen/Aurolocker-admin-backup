class CustomerFollowupTrDetails {

 
    constructor({
    slno,
    customerName,
    mobileNo,
    date_of_open,
    time_of_open,
    terminalid,
    no_of_hours,
    amount,
    status,
    excess_hours,
    excess_amount,
    lockNo,
    passcode,
    balance,
    itemsStored,
    browtype,
    partretamount,
  }) {
    this.slno = slno;
    this.customerName = customerName;
    this.mobileNo = mobileNo;
    this.date_of_open = date_of_open;
    this.time_of_open = time_of_open;
    this.terminalid = terminalid;
    this.no_of_hours = no_of_hours;
    this.amount = amount;
    this.status = status;
    this.excess_hours = excess_hours;
    this.excess_amount = excess_amount;
    this.lockNo = lockNo;
    this.passcode = passcode;
    this.balance = balance;
    this.itemsStored = itemsStored;
    this.browtype = browtype;
    this.partretamount = partretamount;
  }
}

export default CustomerFollowupTrDetails;
