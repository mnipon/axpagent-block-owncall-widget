import React from "react";
import ReactDOM from "react-dom";
import ReactHTMLElement from "react-html-element";
import { unmountComponentAtNode } from "react-dom";

import Root from "./components/Root";

class AXPAgentBlockOwnCall extends ReactHTMLElement {
  connectedCallback() {
    // this.api = window.WS?.widgetAPI(interactionId);
    const interactionId = this.getAttribute("interactionid");

    this.api = window.WS?.widgetAPI(interactionId);
    let getClient = this.api.getClientDetails();
    let getConfiguration = this.api.getConfiguration();

    ReactDOM.render(
      <>
        <Root
          api={this.api}
          interactionId={interactionId}
          clientDetails={getClient}
          getConfiguration={getConfiguration}
        />
      </>,
      this
    );
  }

  disconnectedCallback() {
    unmountComponentAtNode(Root);
  }
}

customElements.define("axpagent-block-owncall", AXPAgentBlockOwnCall);
