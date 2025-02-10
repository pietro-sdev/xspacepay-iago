// /server/botNameGenerator.ts
let currentWordIndex = 0;
let currentNumber = 1;

const wordPairs = [
  "HeatRush",
  "NaughtySecret",
  "WildSin",
  "SexyGaze",
  "LoveFlame",
  "TemptVibe",
  "SeduceMe",
  "BurningHeart",
  "SpicyTouch",
  "SinfulPleasure",
  "PassionGate",
  "LustHaven",
  "DeepCrush",
  "IntenseLove",
  "DarkTempt",
  "KissBliss",
  "EroticVibe",
  "ForbiddenHeat",
  "RedMoon",
  "LoveFever",
  "SinKiss",
  "WildBlush",
  "VelvetPassion",
  "CrimsonTouch",
  "DesirePulse",
  "SweetSins",
  "SensualRush",
  "LustChase",
  "TemptMe",
  "DeepHeat",
  "ScarletNight",
  "BurningLips",
  "SeduceVibe",
  "HoneyLust",
  "HotFantasy",
  "RougeDesire",
  "PassionEcho",
  "LoveStorm",
  "NaughtyFlame",
  "SinMist",
  "WildEuphoria",
  "MoonTempt",
  "DarkEden",
  "TemptationHaze",
  "ForbiddenLush",
  "HeatCrave",
  "LustFlicker",
  "SultryShadows",
  "DesireWaves",
  "WarmSecrets",
  "SensualGleam",
  "HotWhisper",
  "RedMist",
  "VelvetTempt",
  "FieryLust",
  "PassionHush",
  "SweetObsession",
  "LoveLush",
  "WildVelvet",
  "DarkAdore",
  "LustEcho",
  "ScarletDesire",
  "RougeLust",
  "KissPulse",
  "NaughtyRush",
  "WildHush",
  "BlazingHeart",
  "TemptBliss",
  "HeatedGaze",
  "FlameLove",
];

export async function getNextBotUsername() {
  const wordPair = wordPairs[currentWordIndex];
  const botName = `${wordPair} ${currentNumber}`;
  const botUsername = `${wordPair}${currentNumber}Bot`;

  console.log("[botNameGenerator] Gerando bot:", botName, botUsername);

  currentNumber++;
  if (currentNumber > 2) {
    currentNumber = 1;
    currentWordIndex++;
    if (currentWordIndex >= wordPairs.length) {
      currentWordIndex = 0;
    }
  }

  return { botName, botUsername };
}
