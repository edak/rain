
function connectToBle() {
  // Connect to a device by passing the service UUID
  blueTooth.connect("a5f125c0-7cec-4334-9214-58cffb8706c0", gotCharacteristics);
  console.log('trying to connect');
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  console.log('looking for characteristics');
  if (error) { 
    console.log('error: ', error);
  }
  console.log('characteristics: ', characteristics);

  console.log(characteristics.length);
  if (characteristics.length != 2) {
    return;
  }


  for (let i=0; i<2; i++) {
    if (characteristics[i].uuid == 'a5f125c1-7cec-4334-9214-58cffb8706c0') {
      blueToothTXCharacteristic = characteristics[i];
    }
    if (characteristics[i].uuid == 'a5f125c2-7cec-4334-9214-58cffb8706c0') {
      blueToothRXCharacteristic = characteristics[i];
    }
  }

  blueTooth.startNotifications(blueToothRXCharacteristic, gotValue, 'string');
  isConnected = blueTooth.isConnected();

  connectButton.hide();
  showAllParam();

  // Add a event handler when the device is disconnected
  blueTooth.onDisconnected(onDisconnected);
}


// A function that will be called once got values
function gotValue(value) {
  // console.log('value: ', value);
  let splitString = split(value, ',');
  if (splitString[0]=='stat') {//status string
    newData=true;
    if (OTAisActive) {
      OTAisActive = false;
      //OTAinProgress=" ";
      showAllParam();
    }
    if (splitString[1]=='co') {
      wifiConnected=true;
    } else {
      wifiConnected=false;
    }
    batteryVoltage = splitString[2];
    if (splitString[3]=='op') {
      contactOpen=true;
    } else {
      contactOpen=false;
    }
    if (splitString[4]=='bt') {
      buttonPressed=true;
    } else {
      buttonPressed=false;
    }
    macAddress = splitString[5];
    fwVersion = splitString[6];
    ipAddress = splitString[7];
    connectedSSID = splitString[8];
    //here is where time can go
    if (splitString[9]!=null) {
      document.getElementById("currentTimeID").innerHTML = splitString[9];
    }

    if (wifiConnected) {
      otaStartButton.show();
      otaHelpTextTitle.hide();
    } else {
      otaStartButton.hide();
      otaHelpTextTitle.show();
    }

    if (firstConnected) {
      sendData("#param,");
    }
  }


  if (splitString[0]=='ssid') {//ssid string
    firstConnected = false;
    ssidInput.value(splitString[1]);
  }
  if (splitString[0]=='pw') {//pw string
    pwInput.value(splitString[1]);
  }
  if (splitString[0]=='tout') {//timeout
    wifiTimeoutInput.value(splitString[1]/1000);
  }
  if (splitString[0]=='name') {//name
    trigBoardNameInput.value(splitString[1]);
  }
  if (splitString[0]=='sel') {//selection
    triggerOpensTitle.hide();
    triggerOpensInput.hide();
    triggerOpensButton.hide();
    triggerClosesTitle.hide();
    triggerClosesInput.hide();
    triggerClosesButton.hide();
    if (splitString[1]=='Close') {
      triggerSelector.value('Contact Close');
      triggerClosesTitle.show();
      triggerClosesInput.show();
      triggerClosesButton.show();
    }
    if (splitString[1]=='Open') {
      triggerSelector.value('Contact Open');
      triggerOpensTitle.show();
      triggerOpensInput.show();
      triggerOpensButton.show();
    }    
    if (splitString[1]=='Both') {
      triggerSelector.value('Open and Close');
      triggerOpensTitle.show();
      triggerOpensInput.show();
      triggerOpensButton.show();
      triggerClosesTitle.show();
      triggerClosesInput.show();
      triggerClosesButton.show();
    }
  }
  if (splitString[0]=='ope') {//open message
    triggerOpensInput.value(splitString[1]);
  }
  if (splitString[0]=='clo') {//close message
    triggerClosesInput.value(splitString[1]);
  } 
  if (splitString[0]=='tim') {//countdown
    timerInput.value(splitString[1]);
  }
  if (splitString[0]=='tse') {//timer select
    if (splitString[1]=='Nothing') {
      timerSelector.value('Nothing');
      timerStillOpenTitle.hide();
      timerStillOpenInput.hide();
      timerStillOpenButton.hide();
      timerStillClosedTitle.hide();
      timerStillClosedInput.hide();
      timerStillClosedButton.hide();
    }
    if (splitString[1]=='Closed') {
      timerSelector.value('Contact Still Closed');
      timerStillOpenTitle.hide();
      timerStillOpenInput.hide();
      timerStillOpenButton.hide();
      timerStillClosedTitle.show();
      timerStillClosedInput.show();
      timerStillClosedButton.show();
    }
    if (splitString[1]=='Open') {
      timerSelector.value('Contact Still Open');
      timerStillOpenTitle.show();
      timerStillOpenInput.show();
      timerStillOpenButton.show();
      timerStillClosedTitle.hide();
      timerStillClosedInput.hide();
      timerStillClosedButton.hide();
    }
    if (splitString[1]=='Either') {
      timerSelector.value('Either Contact');
      timerStillOpenTitle.show();
      timerStillOpenInput.show();
      timerStillOpenButton.show();
      timerStillClosedTitle.show();
      timerStillClosedInput.show();
      timerStillClosedButton.show();
    }
  }
  if (splitString[0]=='tso') {//still open
    timerStillOpenInput.value(splitString[1]);
  }
  if (splitString[0]=='tsc') {//still closed
    timerStillClosedInput.value(splitString[1]);
  }  
  if (splitString[0]=='lob') {//voltage
    loBatteryInput.value(splitString[1]);
  }
  if (splitString[0]=='bof') {//battery offset
    batteryOffsetInput.value(splitString[1]);
  } 
  if (splitString[0]=='wak') {//wake button message
    wakeButtonInput.value(splitString[1]);
  }


  if (splitString[0]=='rtcm') {//timer units 
    if (splitString[1]=='t') {
      timerUnitSelector.value('Minutes');
    } else {
      timerUnitSelector.value('Seconds');
    }
  }
  

  if (splitString[0]=='losantEnable') {//losant enabled
    if (splitString[1]=='t') {
      losantEnableCheckbox.checked(true);
      losantEnableTitle.show();
      losantEnableButton.show();
      losantTitle.show();
      losantDeviceIdTitle.show();
      losantDeviceIdInput.show();
      losantSaveButton.show();

    } else {
      losantEnableCheckbox.checked(false);
      losantEnableTitle.hide();
      losantEnableButton.hide();
      losantTitle.hide();
      losantDeviceIdTitle.hide();
      losantDeviceIdInput.hide();
      losantSaveButton.hide();
    }
  }

  if (splitString[0]=='losantDevideId') {//losant Device ID  
    losantDeviceIdInput.value(splitString[1]);
  }  
  
  
  if (splitString[0]=='agriwebbEnable') {//agriwebb enabled
    if (splitString[1]=='t') {
      agriwebbEnableCheckbox.checked(true);
      agriwebbEnableTitle.show();
      agriwebbEnableButton.show();
      agriwebbTitle.show();
      agriwebbApiKeyTitle.show();
      agriwebbApiKeyInput.show();
      agriwebbFarmIdTitle.show();
      agriwebbFarmIdInput.show();
      agriwebbSensorIdTitle.show();
      agriwebbSensorIdInput.show();
      agriwebbModeTitle.show();
      agriwebbModeInput.show();
      agriwebbSaveButton.show();

    } else {
      agriwebbEnableCheckbox.checked(false);
      agriwebbEnableTitle.hide();
      agriwebbEnableButton.hide();
      agriwebbTitle.hide();
      agriwebbApiKeyTitle.hide();
      agriwebbApiKeyInput.hide();
      agriwebbFarmIdTitle.hide();
      agriwebbFarmIdInput.hide();
      agriwebbSensorIdTitle.hide();
      agriwebbSensorIdInput.hide();
      agriwebbModeTitle.hide();
      agriwebbModeInput.hide();
      agriwebbSaveButton.hide();
    }
  }

  if (splitString[0]=='agriwebbApi_Key') {//API Key  
    agriwebbApiKeyInput.value(splitString[1]);
  }
  
  if (splitString[0]=='agriwebbFarmId') {//API Key  
    agriwebbFarmIdInput.value(splitString[1]);
  }

  if (splitString[0]=='agriwebbSensorId') {//API Key  
    agriwebbSensorIdInput.value(splitString[1]);
  }
  if (splitString[0]=='agriwebbMode') {//API Key  
    agriwebbModeInput.value(splitString[1]);
  }

  if (splitString[0]=='sipen') {//static ip enable 
    if (splitString[1]=='t') {
      staticEnableCheckbox.checked(true);
      staticIPTitle.show();
      staticIPInput.show();
      staticGatewayTitle.show();
      staticSubnetInput.show();
      staticPrimaryDNSTitle.show();
      staticPrimaryDNSInput.show();
      staticSecondaryDNSTitle.show();
      staticSecondaryDNSInput.show();
      staticSaveButton.show();
      staticGatewayInput.show();
      staticSubnetTitle.show();
    } else {
      staticEnableCheckbox.checked(false);
      staticIPTitle.hide();
      staticIPInput.hide();
      staticGatewayTitle.hide();
      staticSubnetInput.hide();
      staticPrimaryDNSTitle.hide();
      staticPrimaryDNSInput.hide();
      staticSecondaryDNSTitle.hide();
      staticSecondaryDNSInput.hide();
      staticSaveButton.hide();
      staticGatewayInput.hide();
      staticSubnetTitle.hide();
    }
  }
  if (splitString[0]=='sip') {//static ip
    staticIPInput.value(splitString[1]);
  }
  if (splitString[0]=='gip') {//gateway ip
    staticGatewayInput.value(splitString[1]);
  }
  if (splitString[0]=='suip') {//subnet ip
    staticSubnetInput.value(splitString[1]);
  }  
  if (splitString[0]=='pdnsip') {//prim dns
    staticPrimaryDNSInput.value(splitString[1]);
  }
  if (splitString[0]=='sdnsip') {//sec dns
    staticSecondaryDNSInput.value(splitString[1]);
  }

  if (splitString[0]=='clkEnable') {//clock enable
    if (splitString[1]=='t') {
      clockTimerEnableCheckbox.checked(true);
      clockCurrentTime.show();
      clockTimeZoneTitle.show();
      clockTimeZone.show();
      clockTimeZoneButton.show();
      clockSetTimeNTPtitle.show();
      clockAlarmEnableTitle.show();
      clockAlarmEnableCheckbox.show();
      clockAlarmEnableButton.show();
    } else {
      clockTimerEnableCheckbox.checked(false);
      clockCurrentTime.hide();
      clockTimeZoneTitle.hide();
      clockTimeZone.hide();
      clockTimeZoneButton.hide();
      clockSetTimeNTPtitle.hide();
      clockSetTimeButton.hide();
      clockAlarmEnableTitle.hide();
      clockAlarmEnableCheckbox.hide();
      clockAlarmEnableButton.hide();
      clockAlarmSettingTitle.hide();
      clockAlarmHour.hide();
      clockAlarmMinute.hide();
      clockAlarmButton.hide();
      clockNTPupdateonAlarmTitle.hide();
      clockNTPupdateonAlarmCheckbox.hide();
      clockNTPupdateonAlarmButton.hide();
      clockAlarmMessageTitle.hide();
      clockAlarmMessage.hide();
      clockAlarmMessageButton.hide();
    }
  }

  if (wifiConnected && clockTimerEnableCheckbox.checked()) {
    document.getElementById("clockSetTimeNTPtitleID").innerHTML = "Set Time with NTP server ";
    clockSetTimeButton.show();
  } else {
    document.getElementById("clockSetTimeNTPtitleID").innerHTML = "Note: Connect to WiFi to set Time from NTP Server! ";
    clockSetTimeButton.hide();
  }

  if (splitString[0]=='clkTimeZone') {//clock time zone
    clockTimeZone.value(splitString[1]);
  }

  if (splitString[0]=='clkAlarmEnable') {//clock append enable
    if (splitString[1]=='t') {
      clockAlarmEnableCheckbox.checked(true);
      clockAlarmSettingTitle.show();
      clockAlarmHour.show();
      clockAlarmMinute.show();
      clockAlarmButton.show();
      clockNTPupdateonAlarmTitle.show();
      clockNTPupdateonAlarmCheckbox.show();
      clockNTPupdateonAlarmButton.show();
      clockAlarmMessageTitle.show();
      clockAlarmMessage.show();
      clockAlarmMessageButton.show();
    } else {
      clockAlarmEnableCheckbox.checked(false);
      clockAlarmSettingTitle.hide();
      clockAlarmHour.hide();
      clockAlarmMinute.hide();
      clockAlarmButton.hide();
      clockNTPupdateonAlarmTitle.hide();
      clockNTPupdateonAlarmCheckbox.hide();
      clockNTPupdateonAlarmButton.hide();
      clockAlarmMessageTitle.hide();
      clockAlarmMessage.hide();
      clockAlarmMessageButton.hide();
    }
  }
  if (splitString[0]=='clkAlarmHour') {//clock alarm hour
    clockAlarmHour.value(splitString[1]);
  }
  if (splitString[0]=='clkAlarmMinute') {//clock alarm hour
    clockAlarmMinute.value(splitString[1]);
  }
  if (splitString[0]=='clkUpdateNPTenable') {//clock NPT update
    if (splitString[1]=='t') {
      clockNTPupdateonAlarmCheckbox.checked(true);
    } else {
      clockNTPupdateonAlarmCheckbox.checked(false);
    }
  }
  if (splitString[0]=='clkAlarmMessage') {//clock alarm message
    clockAlarmMessage.value(splitString[1]);
  }

  if (splitString[0]=='OTAprog') {//OTA IS IN PROGRESS
    OTAinProgress=splitString[1];
    OTAisActive = true;
    hideAllParam();
  }
}

function onDisconnected() {
  console.log('Device got disconnected.');
  isConnected = false;
  firstConnected = true;
  connectButton.show();
  hideAllParam();
}

function sendData(data) {
  const inputValue = data;
  if (!("TextEncoder" in window)) {
    console.log("Sorry, this browser does not support TextEncoder...");
  }
  var enc = new TextEncoder(); // always utf-8
  blueToothTXCharacteristic.writeValue(enc.encode(inputValue));
}
