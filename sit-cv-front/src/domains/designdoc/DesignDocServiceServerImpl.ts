import DesignDocService from './DesignDocService';
import WebSocketClient from '@/infrastructures/WebSocketClient';
import FunctionModelDetail from './FunctionModelDetail';
import MenuItem from './MenuItem';
import axios from 'axios';
import CrudMatrix from './CrudMatrix';
import Config from '@/infrastructures/Config';

class DesignDocServiceServerImpl implements DesignDocService {
  private static INSTANCE: DesignDocServiceServerImpl;

  private currentDestination!: string;

  public static get instance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new DesignDocServiceServerImpl();
    }
    return this.INSTANCE;
  }

  public fetchMenuItems(callback: (menuItems: MenuItem[]) => void) {
    WebSocketClient.subscribe(
      '/topic/designdoc/list',
      (messageBody) => callback(<MenuItem[]>JSON.parse(messageBody)),
      '/app/designdoc/list'
    );
  }

  public fetchFunctionModelDetail(
    functionId: string,
    callback: (funcionModelDetail: FunctionModelDetail) => void
  ) {
    const destination = '/topic/designdoc/function/' + functionId;

    if (this.currentDestination) {
      WebSocketClient.unsubscribe(this.currentDestination);
    }

    this.currentDestination = destination;

    WebSocketClient.subscribe(
      destination,
      (messageBody) => callback(<FunctionModelDetail>JSON.parse(messageBody)),
      '/app/designdoc/function',
      functionId
    );
  }

  public async getCrudModel() {
    const response = await axios.get<CrudMatrix>(
      `${Config.endpoint}/designdoc/data/crud`
    );
    return response.data;
  }
}

export default DesignDocServiceServerImpl.instance;
