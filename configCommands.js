//ALL DATA SENT OUT FROM THE GUI TOO THE BOARD HERE

// to sanitize strings **********
function checkUserString(userString, lengthCheck) {
  if (match(userString, "#") != null || match(userString, ",") != null) {
    return 'error no # or comma';
  }
  if (userString.length >=lengthCheck) {
    return 'error too long';
  }
  return null;
}

function checkUserIPaddress(userIP) {
  let splitNumbers = split(userIP, '.');
  if (splitNumbers.length>4 || splitNumbers.length<4) {
    return 'error not valid';
  }
  for (let i=0; i<4; i++) {
    if (isNaN(splitNumbers[i])) {
      return 'error not valid';
    }
    if (splitNumbers[i]>255 || splitNumbers[i]<0) {
      return 'error not valid';
    }
  }
  return null;
}

function clockTimerEnableCommand() {
  if (clockTimerEnableCheckbox.checked()) {
    sendData("#clken");
  } else {
    sendData("#clkdi");
  }
}

function agriwebbEnableCommand() {
  if (agriwebbEnableCheckbox.checked()) {
    sendData("#agren");
  } else {
    sendData("#agrdi");
  }
}


function clockTimeZoneButtonCommand() {
  let sanitizer = checkUserString(clockTimeZone.value(), 5);
  if (sanitizer!=null) {
    clockTimeZone.value("err");
    return;
  }
  if (isNaN(clockTimeZone.value())) {
    clockTimeZone.value("err");
    return;
  }
  if (clockTimeZone.value() > 14 || clockTimeZone.value() <-12) {
    clockTimeZone.value("err");
    return;
  }
  sendData("#clkzn,"+clockTimeZone.value());
}
function clockSetTimeNTPCommand() {
  document.getElementById("currentTimeID").innerHTML = "PLEASE WAIT... GETTING TIME";
  sendData("#clkNTPset,");
}

function clockAlarmEnableCommand() {
  if (clockAlarmEnableCheckbox.checked()) {
    sendData("#clkalmen");
  } else {
    sendData("#clkalmdi");
  }
}
function clockAlarmButtonCommand() {
  let sanitizer = checkUserString(clockAlarmHour.value(), 5);
  if (sanitizer!=null) {
    clockAlarmHour.value("err");
    return;
  }
  if (isNaN(clockAlarmHour.value())) {
    clockAlarmHour.value("err");
    return;
  }
  if (clockAlarmHour.value() > 23 || clockAlarmHour.value() <0) {
    clockAlarmHour.value("err");
    return;
  }

  sanitizer = checkUserString(clockAlarmMinute.value(), 5);
  if (sanitizer!=null) {
    clockAlarmMinute.value("err");
    return;
  }
  if (isNaN(clockAlarmMinute.value())) {
    clockAlarmMinute.value("err");
    return;
  }
  if (clockAlarmMinute.value() > 59 || clockAlarmMinute.value() <0) {
    clockAlarmMinute.value("err");
    return;
  }
  sendData("#clkalmtim,"+clockAlarmHour.value() + "," + clockAlarmMinute.value());
}
function clockNTPupdateonAlarmCommand() {
  if (clockNTPupdateonAlarmCheckbox.checked()) {
    sendData("#clkNTPen");
  } else {
    sendData("#clkNTPdi");
  }
}
function clockAlarmMessageButtonCommand() {
  let sanitizer = checkUserString(clockAlarmMessage.value(), 50);
  if (sanitizer!=null) {
    clockAlarmMessage.value(sanitizer);
    return;
  }
  sendData("#clkalarMsg,"+clockAlarmMessage.value());
}

function saveWiFi() {
  let sanitizer = checkUserString(ssidInput.value(), 50);
  if (sanitizer!=null) {
    ssidInput.value(sanitizer);
    return;
  }
  sanitizer = checkUserString(pwInput.value(), 50);
  if (sanitizer!=null) {
    ssidInput.value(sanitizer);
    return;
  }
  if (pwInput.value().length <8) {
    ssidInput.value('error pw too short');
    return;
  }
  sendData("#wifi,"+ssidInput.value() + "," + pwInput.value());
  sendData("#wifi,"+ssidInput.value() + "," + pwInput.value());
}
function wifiTimeoutCommand() {
  let sanitizer = checkUserString(wifiTimeoutInput.value(), 3);
  if (sanitizer!=null) {
    wifiTimeoutInput.value("err");
    return;
  }
  if (isNaN(wifiTimeoutInput.value())) {
    wifiTimeoutInput.value("err");
    return;
  }
  if (wifiTimeoutInput.value() > 60 || wifiTimeoutInput.value() <=0) {
    wifiTimeoutInput.value("err");
    return;
  }
  sendData("#tout,"+wifiTimeoutInput.value());
}

function trigBoardNameCommand() {
  let sanitizer = checkUserString(trigBoardNameInput.value(), 50);
  if (sanitizer!=null) {
    trigBoardNameInput.value(sanitizer);
    return;
  }
  sendData("#name,"+trigBoardNameInput.value());
}

function triggerSelectorCommand() {
  sendData("#sel,"+triggerSelector.value());
}

function triggerOpensCommand() {
  let sanitizer = checkUserString(triggerOpensInput.value(), 50);
  if (sanitizer!=null) {
    triggerOpensInput.value(sanitizer);
    return;
  }
  sendData("#ope,"+triggerOpensInput.value());
}
function triggerClosesCommand() {
  let sanitizer = checkUserString(triggerClosesInput.value(), 50);
  if (sanitizer!=null) {
    triggerClosesInput.value(sanitizer);
    return;
  }
  sendData("#clo,"+triggerClosesInput.value());
}
function timerCommand() {
  let sanitizer = checkUserString(timerInput.value(), 4);
  if (sanitizer!=null) {
    timerInput.value("err");
    return;
  }
  if (isNaN(timerInput.value())) {
    timerInput.value("err");
    return;
  }
  if (timerInput.value() > 255 || timerInput.value() <=0) {
    timerInput.value("err");
    return;
  }
  sendData("#tim,"+timerInput.value());
}
function timerSelectorCommand() {
  sendData("#tse,"+trim(timerSelector.value()));
}

function timerStillOpenCommand() {
  let sanitizer = checkUserString(timerStillOpenInput.value(), 50);
  if (sanitizer!=null) {
    timerStillOpenInput.value(sanitizer);
    return;
  }
  sendData("#tso,"+timerStillOpenInput.value());
}
function timerStillClosedCommand() {
  let sanitizer = checkUserString(timerStillClosedInput.value(), 50);
  if (sanitizer!=null) {
    timerStillClosedInput.value(sanitizer);
    return;
  }
  sendData("#tsc,"+timerStillClosedInput.value());
}
function loBatteryCommand() {
  let sanitizer = checkUserString(loBatteryInput.value(), 5);
  if (sanitizer!=null) {
    loBatteryInput.value("err");
    return;
  }
  if (isNaN(loBatteryInput.value())) {
    loBatteryInput.value("err");
    return;
  }
  if (loBatteryInput.value() > 255 || loBatteryInput.value() <=0) {
    loBatteryInput.value("err");
    return;
  }
  sendData("#lob,"+loBatteryInput.value());
}

function wakeButtonCommand() {
  let sanitizer = checkUserString(wakeButtonInput.value(), 50);
  if (sanitizer!=null) {
    wakeButtonInput.value(sanitizer);
    return;
  }
  sendData("#wak,"+wakeButtonInput.value());
}
function killCommand() {
  sendData("#kill,");
}


function timerUnitSelectorCommand() {
  if (timerUnitSelector.value()=='Minutes') {
    sendData("#rtcme");
  } else {
    sendData("#rtcmd");
  }
}


function staticEnableCommand() {
  if (staticEnableCheckbox.checked()) {
    sendData("#sipen");
  } else {
    sendData("#sipdi");
  }
}

function batteryOffsetCommand() {
  let sanitizer = checkUserString(batteryOffsetInput.value(), 10);
  if (sanitizer!=null) {
    batteryOffsetInput.value("err");
    return;
  }
  if (isNaN(batteryOffsetInput.value())) {
    loBatteryInput.value("err");
    return;
  }

  sendData("#boff,"+batteryOffsetInput.value());
}

function staticSaveCommand() {
  let sanitize = checkUserIPaddress(staticIPInput.value());
  if (sanitize!=null) {
    staticIPInput.value(sanitize);
    return;
  }
  sanitize = checkUserString(staticIPInput.value(), 20);
  if (sanitize!=null) {
    staticIPInput.value(sanitize);
    return;
  }
  sanitize = checkUserIPaddress(staticGatewayInput.value());
  if (sanitize!=null) {
    staticGatewayInput.value(sanitize);
    return;
  }
  sanitize = checkUserString(staticGatewayInput.value(), 20);
  if (sanitize!=null) {
    staticGatewayInput.value(sanitize);
    return;
  }
  sanitize = checkUserIPaddress(staticSubnetInput.value());
  if (sanitize!=null) {
    staticSubnetInput.value(sanitize);
    return;
  }
  sanitize = checkUserString(staticSubnetInput.value(), 20);
  if (sanitize!=null) {
    staticSubnetInput.value(sanitize);
    return;
  } 
  sanitize = checkUserIPaddress(staticPrimaryDNSInput.value());
  if (sanitize!=null) {
    staticPrimaryDNSInput.value(sanitize);
    return;
  }
  sanitize = checkUserString(staticPrimaryDNSInput.value(), 20);
  if (sanitize!=null) {
    staticPrimaryDNSInput.value(sanitize);
    return;
  } 
  sanitize = checkUserIPaddress(staticSecondaryDNSInput.value());
  if (sanitize!=null) {
    staticSecondaryDNSInput.value(sanitize);
    return;
  }
  sanitize = checkUserString(staticSecondaryDNSInput.value(), 20);
  if (sanitize!=null) {
    staticSecondaryDNSInput.value(sanitize);
    return;
  } 
  sendData("#sipset,"+staticIPInput.value()+","+staticGatewayInput.value()+","+staticSubnetInput.value()+","+staticPrimaryDNSInput.value()+","+staticSecondaryDNSInput.value());
}

function otaStartCommand() {
  sendData("#otaStart");
}


function readDocsCommand() {
  window.open('https://trigboard-docs.readthedocs.io/en/latest/configurator.html');
}
function contactCommand() {
  window.open('https://www.kdcircuits.com#contact');
}
function otaGUICommand() {
  window.open('https://github.com/krdarrah/trigUpdater/releases');
}
