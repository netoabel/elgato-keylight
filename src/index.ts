import axios from "axios";
import * as http from "http";

export interface KeyLightState {
  on: number;
  brightness: number;
  temperature: number;
}

export interface State extends Partial<KeyLightState> {}

export class KeyLight {
  private readonly MIN_BRIGHTNESS = 2;
  private readonly MAX_BRIGHTNESS = 100;
  private readonly MIN_TEMPERATURE = 2900;
  private readonly MAX_TEMPERATURE = 7000;
  private readonly REQUEST_TIMEOUT_MS = 3000;
  private readonly agentForHttp4: http.Agent;
  private readonly url: string;

  constructor(host: string = "elgato-key-light-air-ec6e.local", port: number = 9123) {
    this.url = `http://${host}:${port}/elgato/lights`;
    this.agentForHttp4 = new http.Agent({ family: 4 });
  }

  async setBrightness(brightness: number): Promise<void> {
    await this.setState({ brightness });
  }

  async increaseBrightness(by: number): Promise<void> {
    const state = await this.getCurrentState();
    let brightness = state.brightness + by;
    if (brightness > this.MAX_BRIGHTNESS) brightness = this.MAX_BRIGHTNESS;
    await this.setState({ brightness });
  }

  async decreaseBrightness(by: number): Promise<void> {
    const state = await this.getCurrentState();
    let brightness = state.brightness - by;
    if (brightness < this.MIN_BRIGHTNESS) brightness = this.MIN_BRIGHTNESS;
    await this.setState({ brightness });
  }

  async toggleState(): Promise<void> {
    const state = await this.getCurrentState();
    await this.setState({ on: 1 - state.on });
  }

  async setState(state: State): Promise<void> {
    const config = {
      httpAgent: this.agentForHttp4,
      timeout: this.REQUEST_TIMEOUT_MS,
    };
    await axios.put(this.url, { lights: [state] }, config);
  }

  async getCurrentState(): Promise<KeyLightState> {
    const config = {
      httpAgent: this.agentForHttp4,
      timeout: this.REQUEST_TIMEOUT_MS,
    };
    interface LightResponse {
      lights: KeyLightState[];
    }
    const res = await axios.get<LightResponse>(this.url, config);
    return res.data.lights[0];
  }

  async setTemperature(temperature: number): Promise<void> {
    await this.setState({ temperature });
  }

  async increaseTemperature(by: number): Promise<void> {
    const state = await this.getCurrentState();
    let temperature = state.temperature + by;
    if (temperature > this.MAX_TEMPERATURE) temperature = this.MAX_TEMPERATURE;
    await this.setState({ temperature });
  }

  async decreaseTemperature(by: number): Promise<void> {
    const state = await this.getCurrentState();
    let temperature = state.temperature - by;
    if (temperature < this.MIN_TEMPERATURE) temperature = this.MIN_TEMPERATURE;
    await this.setState({ temperature });
  }
}
