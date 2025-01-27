class FolloupcusomterModel {
  constructor({
    slno,
    customerName,
    eventType,
    eventDate,
    eventTime,
    lockerNo,
    terminalId,
    eventTriggeredUser,
    remarks,
    mobileNo,
    state,
    city,
  }) {
    this.slno = slno;
    this.customerName = customerName;
    this.eventType = eventType;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.lockerNo = lockerNo;
    this.terminalId = terminalId;
    this.eventTriggeredUser = eventTriggeredUser;
    this.remarks = remarks;
    this.mobileNo = mobileNo;
    this.state = state;
    this.city = city;
  }
}

export default FolloupcusomterModel;
