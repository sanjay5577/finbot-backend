const { Chat } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
 const OpenAI  = require('openai');
const xlsx = require('xlsx');
const config = require("../config/config");

const openai = new OpenAI({
  apiKey: config.openaiapikey  // This is also the default, can be omitted
});

const getChats = async() =>{


    const chats  = await Chat.find({}).limit(25)

    return chats;
}


const createChat = async(userQuestion) => {

// Load the Excel data
  const workbook = xlsx.readFile('../assests/profitloss.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  // Extract relevant data based on the message
  const extractedData = extractDataFromExcel(data, userQuestion.question); // Custom function to handle extraction

  // Prepare context for ChatGPT
  const context = `Based on the balance sheet, ${extractedData}.`;

  // Call ChatGPT
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a financial assistant.' },
    { role: 'user', content: `${context} ${message}` },
  ],
});

  const botResponse = response.choices[0].message.content;

  // Save the conversation
  const chat = new Chat({ userMessage: message, botResponse });
  await chat.save();

return botResponse;

}


// helper functions


function extractDataFromExcel(data, question) {
    const lowerCaseQuestion = question.toLowerCase();
  
    // Define possible months and categories
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const incomeCategories = ["sales", "services", "other income", "total income"];
    const expenseCategories = ["accounting", "advertising", "assets", "bank charges", "depreciation", "electricity", "insurance", "interest", "motor vehicles", "office supplies", "postage and printing", "office rental", "communication", "repairs and maintenance", "stationary", "subscriptions", "training / seminars", "salaries and wages", "other expenses", "total expenses"];
    const metrics = incomeCategories.concat(expenseCategories).concat(["profit / loss"]);
  
    // Initialize variables to hold extracted elements
    let month = null;
    let category = null;
  
    // Extract the month from the message
    for (let m of months) {
      if (lowerCaseQuestion.includes(m)) {
        month = m;
        break;
      }
    }
  
    // Extract the category from the message
    for (let c of metrics) {
      if (lowerCaseQuestionS.includes(c)) {
        category = c;
        break;
      }
    }
  
    // If both month and category are identified, find the data
    if (month && category) {
      const row = data.find(row => row["Item"].toLowerCase().includes(category));
      if (row) {
        return `The ${category} in ${month.charAt(0).toUpperCase() + month.slice(1)} was ${row[month.charAt(0).toUpperCase() + month.slice(1)]}.`;
      }
    }
  
    // If only the category is identified (e.g., "What was the total income?")
    if (category && !month) {
      const total = data.find(row => row["Item"].toLowerCase().includes(category));
      if (total) {
        return `The ${category} for each month: ${months.map(m => `${m.charAt(0).toUpperCase() + m.slice(1)}: ${total[m.charAt(0).toUpperCase() + m.slice(1)]}`).join(', ')}.`;
      }
    }
  
    // If the question is more complex, you may need to delegate to ChatGPT for interpretation
    return "I'm not sure how to extract that data directly. Let's ask ChatGPT!";
  }

  

module.exports = {
     getChats,
     createChat,
    };
