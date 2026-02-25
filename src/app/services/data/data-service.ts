import { Inject, Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ActivityExtendedFromInterface,
  ChatCompletionResponse,
  Me,
  PageActivityDto,
  StravaAnalysisRequest,
} from '../../interfaces/data';
import { HttpClient } from '@angular/common/http';
import {
  ACTIVITIES_ENDPOINT,
  ACTIVITIES_RELOAD_ENDPOINT,
  AI_QUESTION_ENDPOINT,
  ME_ENDPOINT,
  UPDATE_ACTIVITY_ENDPOINT,
} from './enpoints';
import { Activities } from '../../activities/activities';

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

  updateActivity(request: ActivityExtendedFromInterface): Observable<void> {
    const prepareData = {
      id: request.id,
      npPower: request.isBike && Number(request.npPower) > 0 ? Number(request.npPower) : undefined,
      descriptionTyped: request.descriptionTyped,
    };
    return this.http.post<void>(UPDATE_ACTIVITY_ENDPOINT, prepareData);
  }
}
