import { Injectable } from '@angular/core';

@Injectable()
export class DebuggerService {
  static LOCAL_KEY = 'seed_debugger_user';

  constructor() { }

  simulateUser(id) {
    sessionStorage.setItem(DebuggerService.LOCAL_KEY, id);
  }

  getSimulationUser() {
    return sessionStorage.getItem(DebuggerService.LOCAL_KEY);
  }

  clearSimulationUser() {
    sessionStorage.removeItem(DebuggerService.LOCAL_KEY);
  }
}
