
//globals
let blueToothRXCharacteristic;//this is a blu
let blueToothTXCharacteristic;//this is a blu

let blueTooth;
let isConnected = false;
let connectButton;

let trigBoardImg;
let trigBoardlogoImg;
//status variables
let newData=false;
let wifiConnected = false;
let batteryVoltage=0.0;
let contactOpen = false;
let buttonPressed = false;
let LEDblinkStartTime;
let OTAinProgress=" ";
let OTAisActive = false;
let firstConnected = true;
//let binFileInput;

function preload() {
  trigBoardImg = loadImage('data/trigBoard.png');
  trigBoardlogoImg = loadImage('data/trigBoardlogo.png');
}


function setup() {

  // Create a p5ble class
  console.log("setting up");
  blueTooth = new p5ble();

  connectButton = createButton('CONNECT');
  connectButton.mousePressed(connectToBle);
  connectButton.position(15, 150);
  connectButton.style('color', color(255));
  connectButton.style('background-color', color(77, 158, 106));

  LEDblinkStartTime=millis();

  killButton = createButton('DISCONNECT');
  killButton.position(15, 150);
  killButton.style('color', color(255));
  killButton.style('background-color', color(208, 93, 73));
  killButton.mousePressed(killCommand);

  otaStartButton = createButton('Initialize OTA');
  otaStartButton.position(15, 180);
  otaStartButton.mousePressed(otaStartCommand);
  otaHelpTextTitle = createElement('h5', 'OTA Updates<br>can be Initialized<br>when Connected<br>to WiFi');
  otaHelpTextTitle.position(15, 180);

  otaGUIButton = createButton('Get OTA Utility <br>for Wireless<br>FW Updates');
  otaGUIButton.position(380, 240);
  otaGUIButton.style('color', color(255));
  otaGUIButton.style('background-color', color(62, 129, 182));
  otaGUIButton.mousePressed(otaGUICommand);


  readDocsButton = createButton('REFERENCE');
  readDocsButton.position(380, 150);
  readDocsButton.style('color', color(255));
  readDocsButton.style('background-color', color(62, 129, 182));
  readDocsButton.mousePressed(readDocsCommand);

  contactButton = createButton('CONTACT<br>or<br>REPORT ISSUES');
  contactButton.position(380, 180);
  contactButton.style('color', color(255));
  contactButton.style('background-color', color(62, 129, 182));
  contactButton.mousePressed(contactCommand);

  let yPositionStart = 600;
  ssidTitle = createElement('h3', 'WiFi SSID (2.4GHz)');
  ssidTitle.position(10, yPositionStart);
  ssidInput = createInput('');
  ssidInput.position(ssidTitle.size().width+ssidTitle.x+10, ssidTitle.size().height+ssidTitle.y);

  ssidPw = createElement('h3', 'WiFi Password');
  ssidPw.position(10, ssidTitle.size().height+ssidTitle.y);
  pwInput = createInput('', 'password');
  pwInput.position(ssidPw.size().width+ssidPw.x+10, ssidPw.size().height+ssidPw.y);  
  WiFiButton = createButton('Save and Connect with DHCP');
  WiFiButton.position(pwInput.x+pwInput.width, pwInput.y);
  WiFiButton.mousePressed(saveWiFi);
  //**************************************
  staticEnableTitle = createElement('h4', 'Static IP: ');
  staticEnableTitle.position(10, ssidPw.size().height+ssidPw.y+5);
  staticEnableCheckbox = createCheckbox('', false);
  staticEnableCheckbox.position(staticEnableTitle.size().width+staticEnableTitle.x+10, staticEnableTitle.size().height+staticEnableTitle.y);
  staticEnableButton = createButton('Save');
  staticEnableButton.position(staticEnableTitle.size().width+staticEnableTitle.x+40, staticEnableTitle.size().height+staticEnableTitle.y);
  staticEnableButton.mousePressed(staticEnableCommand);
  //**************************************
  staticIPTitle = createElement('h4', 'Static IP:');
  staticIPTitle.position(50, staticEnableTitle.size().height+staticEnableTitle.y+5);
  staticIPInput = createInput('');
  staticIPInput.position(staticIPTitle.size().width+staticIPTitle.x+10, staticIPTitle.size().height+staticIPTitle.y);
  staticGatewayTitle = createElement('h4', 'Gateway:');
  staticGatewayTitle.position(50, staticIPTitle.size().height+staticIPTitle.y+5);
  staticGatewayInput = createInput('');
  staticGatewayInput.position(staticGatewayTitle.size().width+staticGatewayTitle.x+10, staticGatewayTitle.size().height+staticGatewayTitle.y);
  staticSubnetTitle = createElement('h4', 'Subnet:');
  staticSubnetTitle.position(50, staticGatewayTitle.size().height+staticGatewayTitle.y+5);
  staticSubnetInput = createInput('');
  staticSubnetInput.position(staticSubnetTitle.size().width+staticSubnetTitle.x+10, staticSubnetTitle.size().height+staticSubnetTitle.y);
  staticPrimaryDNSTitle = createElement('h4', 'Primary DNS:');
  staticPrimaryDNSTitle.position(50, staticSubnetTitle.size().height+staticSubnetTitle.y+5);
  staticPrimaryDNSInput = createInput('');
  staticPrimaryDNSInput.position(staticPrimaryDNSTitle.size().width+staticPrimaryDNSTitle.x+10, staticPrimaryDNSTitle.size().height+staticPrimaryDNSTitle.y);
  staticSecondaryDNSTitle = createElement('h4', 'Secondary DNS:');
  staticSecondaryDNSTitle.position(50, staticPrimaryDNSTitle.size().height+staticPrimaryDNSTitle.y+5);
  staticSecondaryDNSInput = createInput('');
  staticSecondaryDNSInput.position(staticSecondaryDNSTitle.size().width+staticSecondaryDNSTitle.x+10, staticSecondaryDNSTitle.size().height+staticSecondaryDNSTitle.y);
  staticSaveButton = createButton('Save and Connect with Static IP');
  staticSaveButton.position(staticSecondaryDNSInput.size().width+staticSecondaryDNSInput.x, staticSecondaryDNSInput.y);
  staticSaveButton.mousePressed(staticSaveCommand);
  //**************************************
  wifiTimeoutTitle = createElement('h4', 'WiFi Timeout (seconds 1-60)');
  wifiTimeoutTitle.position(10, staticSecondaryDNSTitle.size().height+staticSecondaryDNSTitle.y+5);
  wifiTimeoutInput = createInput('');
  wifiTimeoutInput.size(30);
  wifiTimeoutInput.position(wifiTimeoutTitle.size().width+wifiTimeoutTitle.x+10, wifiTimeoutTitle.size().height+wifiTimeoutTitle.y);  
  wifiTimeoutButton = createButton('Save');
  wifiTimeoutButton.position(wifiTimeoutInput.x+wifiTimeoutInput.width, wifiTimeoutInput.y);
  wifiTimeoutButton.mousePressed(wifiTimeoutCommand);
  //**************************************
  trigBoardNameTitle = createElement('h4', 'trigBoard Name');
  trigBoardNameTitle.position(10, wifiTimeoutTitle.size().height+wifiTimeoutTitle.y+5);
  trigBoardNameInput = createInput('');
  trigBoardNameInput.position(trigBoardNameTitle.size().width+trigBoardNameTitle.x+10, trigBoardNameTitle.size().height+trigBoardNameTitle.y);  
  trigBoardNameButton = createButton('Save');
  trigBoardNameButton.position(trigBoardNameInput.x+trigBoardNameInput.width, trigBoardNameInput.y);
  trigBoardNameButton.mousePressed(trigBoardNameCommand);
  //**************************************
  trigTriggerSelectionTitle = createElement('h4', 'Wake on:');
  trigTriggerSelectionTitle.position(10, trigBoardNameTitle.size().height+trigBoardNameTitle.y+5);
  triggerSelector = createSelect();
  triggerSelector.position(trigTriggerSelectionTitle.x+trigTriggerSelectionTitle.size().width+10, trigTriggerSelectionTitle.size().height+trigTriggerSelectionTitle.y);
  triggerSelector.option('Contact Close');
  triggerSelector.option('Contact Open');
  triggerSelector.option('Open and Close');
  triggerSelectorButton = createButton('Save');
  triggerSelectorButton.position(triggerSelector.x+triggerSelector.width+100, triggerSelector.y);
  triggerSelectorButton.mousePressed(triggerSelectorCommand);
  //**************************************
  triggerOpensTitle = createElement('h4', 'Message when Contact Opens:');
  triggerOpensTitle.position(10, highSpeedEnableTitle.size().height+highSpeedEnableTitle.y+5);
  triggerOpensInput = createInput('');
  triggerOpensInput.position(triggerOpensTitle.size().width+triggerOpensTitle.x+10, triggerOpensTitle.size().height+triggerOpensTitle.y);  
  triggerOpensButton = createButton('Save');
  triggerOpensButton.position(triggerOpensInput.x+triggerOpensInput.width, triggerOpensInput.y);
  triggerOpensButton.mousePressed(triggerOpensCommand);
  //**************************************
  triggerClosesTitle = createElement('h4', 'Message when Contact Closes:');
  triggerClosesTitle.position(10, triggerOpensTitle.size().height+triggerOpensTitle.y+5);
  triggerClosesInput = createInput('');
  triggerClosesInput.position(triggerClosesTitle.size().width+triggerClosesTitle.x+10, triggerClosesTitle.size().height+triggerClosesTitle.y);  
  triggerClosesButton = createButton('Save');
  triggerClosesButton.position(triggerClosesInput.x+triggerClosesInput.width, triggerClosesInput.y);
  triggerClosesButton.mousePressed(triggerClosesCommand);
  //**************************************
  wakeButtonTitle = createElement('h4', 'Message when Wake Button Pressed:');
  wakeButtonTitle.position(10, triggerClosesTitle.size().height+triggerClosesTitle.y+5);
  wakeButtonInput = createInput('');
  wakeButtonInput.position(wakeButtonTitle.size().width+wakeButtonTitle.x+10, wakeButtonTitle.size().height+wakeButtonTitle.y);  
  wakeButtonButton = createButton('Save');
  wakeButtonButton.position(wakeButtonInput.x+wakeButtonInput.width, wakeButtonInput.y);
  wakeButtonButton.mousePressed(wakeButtonCommand);
  //**************************************
  timerUnitTitle = createElement('h4', 'Timer Units: ');
  timerUnitTitle.position(10, wakeButtonTitle.size().height+wakeButtonTitle.y+5);
  timerUnitSelector = createSelect();
  timerUnitSelector.position(timerUnitTitle.x+timerUnitTitle.size().width+10, timerUnitTitle.size().height+timerUnitTitle.y);
  timerUnitSelector.option('Minutes');
  timerUnitSelector.option('Seconds');
  timerUnitSelectorButton = createButton('Save');
  timerUnitSelectorButton.position(timerUnitSelector.x+timerUnitSelector.width+50, timerUnitSelector.y);
  timerUnitSelectorButton.mousePressed(timerUnitSelectorCommand);
  //**************************************
  timerTitle = createElement('h4', 'Timer Wake Time (1-255)');
  timerTitle.position(10, timerUnitTitle.size().height+timerUnitTitle.y+5);
  timerInput = createInput('');
  timerInput.size(50);
  timerInput.position(timerTitle.size().width+timerTitle.x+10, timerTitle.size().height+timerTitle.y);  
  timerButton = createButton('Save');
  timerButton.position(timerInput.x+timerInput.width, timerInput.y);
  timerButton.mousePressed(timerCommand);
  //**************************************
  timerSelectionTitle = createElement('h4', 'Timer Checks for Lo-Battery and: ');
  timerSelectionTitle.position(10, timerTitle.size().height+timerTitle.y+5);
  timerSelector = createSelect();
  timerSelector.position(timerSelectionTitle.x+timerSelectionTitle.size().width+10, timerSelectionTitle.size().height+timerSelectionTitle.y);
  timerSelector.option('Nothing');
  timerSelector.option('Contact Still Closed');
  timerSelector.option('Contact Still Open');
  timerSelector.option('Either Contact');
  timerSelectorButton = createButton('Save');
  timerSelectorButton.position(timerSelector.x+timerSelector.width+100, timerSelector.y);
  timerSelectorButton.mousePressed(timerSelectorCommand);
  //**************************************
  timerStillOpenTitle = createElement('h4', 'Timer Message for Contact still Open:');
  timerStillOpenTitle.position(10, timerSelectionTitle.size().height+timerSelectionTitle.y+5);
  timerStillOpenInput = createInput('');
  timerStillOpenInput.position(timerStillOpenTitle.size().width+timerStillOpenTitle.x+10, timerStillOpenTitle.size().height+timerStillOpenTitle.y);  
  timerStillOpenButton = createButton('Save');
  timerStillOpenButton.position(timerStillOpenInput.x+timerStillOpenInput.width, timerStillOpenInput.y);
  timerStillOpenButton.mousePressed(timerStillOpenCommand);
  //**************************************
  timerStillClosedTitle = createElement('h4', 'Timer Message for Contact still Closed:');
  timerStillClosedTitle.position(10, timerStillOpenTitle.size().height+timerStillOpenTitle.y+5);
  timerStillClosedInput = createInput('');
  timerStillClosedInput.position(timerStillClosedTitle.size().width+timerStillClosedTitle.x+10, timerStillClosedTitle.size().height+timerStillClosedTitle.y);  
  timerStillClosedButton = createButton('Save');
  timerStillClosedButton.position(timerStillClosedInput.x+timerStillClosedInput.width, timerStillClosedInput.y);
  timerStillClosedButton.mousePressed(timerStillClosedCommand);
  //**************************************
  clockTimerEnableTitle = createElement('h4', 'Clock Enable: (supported in FW 8/16/21 or newer)');
  clockTimerEnableTitle.position(10, timerStillClosedTitle.size().height+timerStillClosedTitle.y+5);
  clockTimerEnableCheckbox = createCheckbox('', false);
  clockTimerEnableCheckbox.position(clockTimerEnableTitle.size().width+clockTimerEnableTitle.x+10, clockTimerEnableTitle.size().height+clockTimerEnableTitle.y);
  clockTimerEnableButton = createButton('Save');
  clockTimerEnableButton.position(clockTimerEnableTitle.size().width+clockTimerEnableTitle.x+40, clockTimerEnableTitle.size().height+clockTimerEnableTitle.y);
  clockTimerEnableButton.mousePressed(clockTimerEnableCommand);
  clockCurrentTime = createElement('h4', 'Current Value: 00:00:00 mm/dd/yy');
  clockCurrentTime.position(20, clockTimerEnableTitle.size().height+clockTimerEnableTitle.y+5);
  clockCurrentTime.id('currentTimeID');
  clockTimeZoneTitle = createElement('h4', 'Timezone Offset ex. -5 for EST: ');
  clockTimeZoneTitle.position(20, clockCurrentTime.size().height+clockCurrentTime.y+5);
  clockTimeZone = createInput('');
  clockTimeZone.size(40);
  clockTimeZone.position(clockTimeZoneTitle.size().width+clockTimeZoneTitle.x+10, clockTimeZoneTitle.size().height+clockTimeZoneTitle.y);  
  clockTimeZoneButton = createButton('Save');
  clockTimeZoneButton.position(clockTimeZone.x+clockTimeZone.width, clockTimeZone.y);
  clockTimeZoneButton.mousePressed(clockTimeZoneButtonCommand);
  clockSetTimeNTPtitle = createElement('h4', 'Set Time with NTP server');
  clockSetTimeNTPtitle.id('clockSetTimeNTPtitleID');
  clockSetTimeNTPtitle.position(20, clockTimeZoneTitle.size().height+clockTimeZoneTitle.y+5);
  clockSetTimeButton = createButton('Set');
  clockSetTimeButton.position(clockSetTimeNTPtitle.x+clockSetTimeNTPtitle.size().width+10, clockSetTimeNTPtitle.y+clockSetTimeNTPtitle.size().height);
  clockSetTimeButton.mousePressed(clockSetTimeNTPCommand);
  clockAlarmEnableTitle = createElement('h4', 'Daily Alarm Wake Enable: ');
  clockAlarmEnableTitle.position(20, clockAlarmEnableTitle.size().height+clockAlarmEnableTitle.y+5);
  clockAlarmEnableCheckbox = createCheckbox('', false);
  clockAlarmEnableCheckbox.position(clockAlarmEnableTitle.size().width+clockAlarmEnableTitle.x+10, clockAlarmEnableTitle.size().height+clockAlarmEnableTitle.y);
  clockAlarmEnableButton = createButton('Save');
  clockAlarmEnableButton.position(clockAlarmEnableTitle.size().width+clockAlarmEnableTitle.x+40, clockAlarmEnableTitle.size().height+clockAlarmEnableTitle.y);
  clockAlarmEnableButton.mousePressed(clockAlarmEnableCommand); 
  clockAlarmSettingTitle = createElement('h4', 'Alarm Setting in 24hr format hh:mm');
  clockAlarmSettingTitle.position(30, clockAlarmEnableTitle.size().height+clockAlarmEnableTitle.y+5);
  clockAlarmHour = createInput('');
  clockAlarmHour.size(40);
  clockAlarmHour.position(50, clockAlarmSettingTitle.size().height+clockAlarmSettingTitle.y+25);  
  clockAlarmMinute = createInput('');
  clockAlarmMinute.size(40);
  clockAlarmMinute.position(clockAlarmHour.size().width+clockAlarmHour.x+10, clockAlarmSettingTitle.size().height+clockAlarmSettingTitle.y+25);  
  clockAlarmButton = createButton('Save');
  clockAlarmButton.position(clockAlarmMinute.x+clockAlarmMinute.width+5, clockAlarmMinute.y);
  clockAlarmButton.mousePressed(clockAlarmButtonCommand);
  clockNTPupdateonAlarmTitle = createElement('h4', 'Update Time with NTP Server on every Alarm Wake: ');
  clockNTPupdateonAlarmTitle.position(30, clockAlarmHour.y+5);
  clockNTPupdateonAlarmCheckbox = createCheckbox('', false);
  clockNTPupdateonAlarmCheckbox.position(clockNTPupdateonAlarmTitle.size().width+clockNTPupdateonAlarmTitle.x+10, clockNTPupdateonAlarmTitle.size().height+clockNTPupdateonAlarmTitle.y);
  clockNTPupdateonAlarmButton = createButton('Save');
  clockNTPupdateonAlarmButton.position(clockNTPupdateonAlarmTitle.size().width+clockNTPupdateonAlarmTitle.x+40, clockAlarmEnableTitle.size().height+clockNTPupdateonAlarmTitle.y);
  clockNTPupdateonAlarmButton.mousePressed(clockNTPupdateonAlarmCommand); 
  clockAlarmMessageTitle = createElement('h4', 'Alarm Wake Message: ');
  clockAlarmMessageTitle.position(30, clockNTPupdateonAlarmTitle.size().height+clockNTPupdateonAlarmTitle.y+5);
  clockAlarmMessage = createInput('');
  //clockAlarmMessage.size(40);
  clockAlarmMessage.position(clockAlarmMessageTitle.size().width+clockAlarmMessageTitle.x+10, clockAlarmMessageTitle.size().height+clockAlarmMessageTitle.y);  
  clockAlarmMessageButton = createButton('Save');
  clockAlarmMessageButton.position(clockAlarmMessage.x+clockAlarmMessage.width, clockAlarmMessage.y);
  clockAlarmMessageButton.mousePressed(clockAlarmMessageButtonCommand);
  //**************************************
  loBatteryTitle = createElement('h4', 'Low Battery Voltage Threshold:');
  loBatteryTitle.position(10, missionCriticalTimeTitle.size().height+missionCriticalTimeTitle.y+5);
  loBatteryInput = createInput('');
  loBatteryInput.size(40);
  loBatteryInput.position(loBatteryTitle.size().width+loBatteryTitle.x+10, loBatteryTitle.size().height+loBatteryTitle.y);  
  loBatteryButton = createButton('Save');
  loBatteryButton.position(loBatteryInput.x+loBatteryInput.width, loBatteryInput.y);
  loBatteryButton.mousePressed(loBatteryCommand);
 //**************************************
  batteryOffsetTitle = createElement('h4', 'Battery Voltage  Calibration Offset:');
  batteryOffsetTitle.position(10, mqttTopicTitle.size().height+mqttTopicTitle.y+50);
  batteryOffsetInput = createInput('');
  batteryOffsetInput.size(40);
  batteryOffsetInput.position(batteryOffsetTitle.size().width+batteryOffsetTitle.x+10, batteryOffsetTitle.size().height+batteryOffsetTitle.y);  
  batteryOffsetButton = createButton('Save');
  batteryOffsetButton.position(batteryOffsetInput.x+batteryOffsetInput.width, batteryOffsetInput.y);
  batteryOffsetButton.mousePressed(batteryOffsetCommand);
  //**************************************

  createCanvas(600, batteryOffsetInput.y+100);


  hideAllParam();
}


function draw() {
  drawScreen();
}
