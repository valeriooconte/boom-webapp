# HermIA

This is a web application developed during the **B.Future Challenge** in collaboration with **Var Group**.

**HermIA** takes its name from the fusion of *Hermes*, the swift messenger of the Gods in Greek mythology, and *Artificial Intelligence*, as LLMs represent the core tool that enables the generation of such "messages"—suggestions for consulting activities and meeting reports—aimed at making meetings more productive and accelerating the creation and delivery of post-meeting outputs.

You can try **HermIA** at this [**link**](https://hermia.vercel.app).

## Features

HermIA leverages **real-time analysis** of the conversation between customer and consultant, providing feedback and suggestions obtained through interaction with an **AI agent** specialized in:
- Keyword identification  
- Customer sentiment analysis  
- Information extraction  
- Report generation  

## Technologies

The development of this platform is based on three key technologies:
- **n8n**: creation of AI workflows  
- **Next.js**: implementation of the client-side and server-side web app  
- **Vercel**: build and deployment of the web app  

## How to use

Currently, the *Dashboard* and *Clienti* sections are mockups.  
The main feature can be tested in the **Incontro** section, where you can:
- Set the customer company name in the *Nome azienda* text field  
- Start and pause real-time transcription (using the *Registra/Pausa* button)  
- Get tips and insights about the ongoing conversation from the AI agent (using the *Suggerimento* button)  
- Select text in the conversation area and get detailed information about it from the AI agent (using the *Interroga AI su "..."* button)  
- End the meeting, sending the transcription and all collected information to another AI workflow to generate the final meeting report (using the *Termina* button)  

You will see the real-time transcription in the left panel, where you can also edit it, and all AI-generated information in the right panel.  

Once you click the *Termina* button, wait until a green *Salvato!* message appears next to the buttons.  
You can then go to the **Report** section, where you can:
1. Click on the card named after the customer company  
2. Read and edit the generated report in the *Report* text area  
3. Use the **Invia Report via Email** button to send the report to the customer’s email address (specified in the *Indirizzo Email* text field)
