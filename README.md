# HermIA - VAR Group

This is a web application developed during the **B.Future Challenge** in collaboration with **VAR Group**.

**HermIA** takes its name from the fusion of *Hermes*, the swift messenger of the Gods in Greek mythology, and *Artificial Intelligence*, as LLM represents the core tool that allows us to generate such "messages" consisting of suggestions for consulting activities and meeting reports, with the aim of making the meeting moment more productive and speeding up the generation and transmission of post-meeting outputs.

You can try **HermIA** at this [**link**](https://boom-webapp.vercel.app/).

## Features

HermIA leverages **real-time analysis** of the conversation between customer and consultant, providing feedback and suggestions obtained through interaction with an **AI agent** specialized in:
- Key words identification
- Customer sentiment analysis 
- Information extraction starting from mentioned technologies
- Creation of comprehensive reports to summarize the meeting

## Technologies

The development of this platform was based on three key technologies:
- **n8n**: AI workflows realization
- **Next.js**: web-app client side and server-side implementation
- **Vercel**: web-app build and deployment

## How to use

Currently *Dashboard* and *Clienti* sections are mockups. The main feature can be tried in the **Incontro** section, where you can:
- Set the customer company name in the *Nome azienda* text field
- Start and pause real-time transcription (using the *Regista/Pausa* button)
- Get tips and insights into the conversation so far from the AI agent (using the *Suggerimento* button)
- Select text in the conversation text area and get information about it through the AI agent (using the *Interroga AI su "..."* button)
- End the meeting, sending the transcription and all the information collected to another AI workflow in order to generate the final meeting report (using the *Termina*) button

You will se the real-time transcription in the left window, where you can also edit it, and all the AI-generated information in the right window of the screen.

At the end, you can go to the **Report** section, click on the name of the customer company, read and edit the generated report in the *Report* text area, and finally you can try use the **Invia Report via Email** button to send the report to the customer e-mail address, to specify in the *Indirizzo Email* text field.