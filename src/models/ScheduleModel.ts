import { RunResult } from "sqlite3";
import db from "../database/SQLiteConnection";
import { Schedule } from "../types/Schedule.type";
import { log } from "console";

export default class ScheduleModel {

  /**
   * Helper function to run a query
   * @param query 
   * @param params 
   * @returns 
   */
  static runQuery(query: string, params: any[]): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(this);
        }
      });
    });
  }

  /**
   * Helper function to get a query
   * @param query 
   * @param params 
   * @returns 
   */
  static getQuery(query: string, params: any[]): Promise<Schedule[]> {
    return new Promise((resolve, reject) => {
      db.all(query, params, function(err, row) {
        if (err) {
          reject(err.message);
        } else {
          resolve(row as Schedule[]);
        }
      });
    });
    
  }

  /**
   * Create a new schedule
   * @param schedule 
   * @returns id of the new schedule or false
   */
  static async create(schedule: Schedule): Promise<number | boolean> {
    try {
      const result:RunResult = await ScheduleModel.runQuery(
        `INSERT INTO schedules (email, message, endAt) VALUES (?, ?, ?)`,
        [schedule.email, schedule.message, schedule.endAt]
      );
      return result.lastID;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get all schedules
   * @returns all schedules
   */
  static async getAll(): Promise<Schedule[]> {
    try {
      const result: Schedule[] = await ScheduleModel.getQuery(
        `SELECT * FROM schedules`,
        []
      );

      return result;
    } catch (e) {
      return [];
    }
  }

  /**
   * Removes as schedule
   * @param id 
   * @returns 
   */
  static async remove(id: number): Promise<boolean> {
    try {
      const result: RunResult = await ScheduleModel.runQuery(
        `DELETE FROM schedules WHERE id = ?`,
        [id]
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}