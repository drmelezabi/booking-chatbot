import Handlebars from "handlebars";

import { levelCode, levels } from "../config/enums";

const noticeMessageTemplate = (level: levels, information: string): string => {
  try {
    // Define your HTML template
    const debugTemplate = `
      <!DOCTYPE html>
      <html>
      
      <head>
          <style>
              /* White background with colored header and footer */
              .email-header {
                  background-color: ${levelCode[level]};
                  color: white;
                  padding: 20px;
                  font-size: 24px;
                  text-align: center;
                  font-family: Arial, sans-serif;
              }
      
              .email-body {
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
              }
      
              .email-footer {
                  background-color: ${levelCode[level]};
                  color: white;
                  padding: 10px;
                  text-align: center;
                  font-family: Arial, sans-serif;
              }
          </style>
      </head>
      
      <body>
          <div class="email-header">${
            level === "info" ? "Information" : "Warning"
          }</div>
          <div class="email-body">
              <p>Hello,</p>
              <p>This is an important ${
                level === "info" ? "information" : "warning"
              } message:</p>
              <p>${information}</p>
              <p>Please take note of this.</p>
          </div>
          <div class="email-footer">
              This message is of ${
                level === "info" ? "informational" : "warning"
              } nature. Pay attention to it.
          </div>
      </body>
      
      </html>      
            `;

    // Compile the template
    const compiledTemplate = Handlebars.compile(debugTemplate);

    // Replace placeholders with actual data
    return compiledTemplate({ level, information });
  } catch (error) {
    console.error(error);
    return "some notice you should know";
  }
};

export default noticeMessageTemplate;
