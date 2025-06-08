# Custom twitch chat

<img src="/static/chatPreview.png" align=right width=404 height=325 />

chat for twitch with support for custom css made in the form of a site


## Pages

` / ` — Main page with settings and custom css textarea
` /chat/:channel ` — Chat of channel
` /css/clear ` — Page that clears custom css

<details>
<summary>How it works?</summary>

1. The client connects to the twitch websocket server `wss://irc-ws.chat.twitch.tv/` on behalf of justifan (anonymous user)

2. Client join to channel `JOIN #xQc`
3. Receiving, parsing and displaying messages on the screen

</details>

<details>
<summary>How to install to OBS Studio?</summary>

Step 1
<img src='/static/step_1.png'/>
Step 2
<img src='/static/step_2.png'/>
Step 3
<img src='/static/step_3.png'/>

</details>
<hr />
<a href='/src/components/ChatView.vue#L15'>Message parser</a><br>
<a href='/src/components/ChatMessage.vue#L20'>Emote parser</a>