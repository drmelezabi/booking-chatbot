import Handlebars from "handlebars";

import { levelCode, levels } from "../config/enums";

const bugMessageTemplate = (level: levels, content: string): string => {
  try {
    // Define your HTML template
    const debugTemplate = `
      <!DOCTYPE html>
      <html>
      
      <head>
          <style>
              /* Red for debugging, orange for trace */
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
      
              .debug-error {
                  font-family: monospace;
                  white-space: pre;
                  background-color: #f5f5f5;
                  padding: 20px;
                  border: 1px solid #ddd;
                  overflow-x: auto;
              }
      
              .email-footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 14px;
              }
          </style>
      </head>
      
      <body>
          <div class="email-header">Sanad ${level} Message</div>
          <div class="email-body">
              <p>Hello,</p>
              <p>This is a ${level} message:</p>
              <div class="debug-info">${content}</div>
              <p>Thank you!</p>
          </div>
          <div class="email-footer">
              This email is generated for debugging purposes. Please do not reply.
          </div>
      </body>
      
      </html>      
            `;

    // Compile the template
    const compiledTemplate = Handlebars.compile(debugTemplate);

    // Replace placeholders with actual data
    return compiledTemplate({ level, content });
  } catch (error) {
    console.error(error);
    return "hello this is my message";
  }
};

export default bugMessageTemplate;
