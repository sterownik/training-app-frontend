import { Inject, Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import {
  ActivityExtendedFromInterface,
  ChatCompletionResponse,
  GetLastChat,
  Me,
  PageActivityDto,
  StravaAnalysisRequest,
} from '../../interfaces/data';
import { HttpClient } from '@angular/common/http';
import {
  ACTIVITIES_ENDPOINT,
  ACTIVITIES_RELOAD_ENDPOINT,
  AI_QUESTION_ENDPOINT,
  ATHLETE_INFO,
  GET_EXCEL,
  GET_LAST_CHAT,
  ME_ENDPOINT,
  UPDATE_ACTIVITY_ENDPOINT,
} from './enpoints';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  getMe(): Observable<Me> {
    return this.http.get<Me>(ME_ENDPOINT);
  }

  getActivities(): Observable<PageActivityDto> {
    return this.http.get<PageActivityDto>(ACTIVITIES_ENDPOINT);
  }

  reloadActivities(): Observable<String> {
    return this.http.get<String>(ACTIVITIES_RELOAD_ENDPOINT);
  }

  aiQuestion(request: StravaAnalysisRequest): Observable<ChatCompletionResponse> {
    return this.http.post<ChatCompletionResponse>(AI_QUESTION_ENDPOINT, request);
  }

  getExcel(): Observable<Blob> {
    return this.http.get(GET_EXCEL, { responseType: 'blob' });
  }

  getLastChat(): Observable<GetLastChat[]> {
    return this.http.get<GetLastChat[]>(GET_LAST_CHAT);
  }

  getAthleteInfo(): Observable<string> {
    return this.http.get<string>(ATHLETE_INFO);
  }

  updateAthleteInfo(athleteInfo: string): Observable<void> {
    return this.http.post<void>(ATHLETE_INFO, athleteInfo);
  }

  updateActivity(request: ActivityExtendedFromInterface): Observable<void> {
    const prepareData = {
      id: request.id,
      npPower: request.isBike && Number(request.npPower) > 0 ? Number(request.npPower) : undefined,
      descriptionTyped: request.descriptionTyped,
    };
    return this.http.post<void>(UPDATE_ACTIVITY_ENDPOINT, prepareData);
  }
}
