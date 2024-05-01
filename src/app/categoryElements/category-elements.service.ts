import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryElementsService {
  private elements: MainMenuCategoryDtos[] = [];
  private elementsUpdated = new Subject<MainMenuCategoryDtos[]>();

  constructor(private http: HttpClient) {}
  // private baseUrl = 'https://api.apismarthome-wisowski-konrad.com/api';
  private baseUrl = 'http://192.168.1.103:3000/api';

  getTokenFromStorage(): string | null {
    const token = localStorage.getItem('token');
    if (token) return token;
    else return 'TwojSekretnyTokenTutaj';
  }

  getAllElements(): Observable<any[]> {
    return this.http.get<{ message: string; elem: any[] }>(`${this.baseUrl}/elements`).pipe(
      map((elementsData) => {
        return elementsData.elem.map((element) => ({
          _id: element._id,
          buttonText: element.buttonText,
          elementType: element.elementType,
          elementPosition: element.elementPosition,
          icon: element.icon,
          value: element.value,
          automation: element.automation,
        }));
      })
    );
  }

  getElementsByType(type: string) {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(`${this.baseUrl}/elements/elementsType/` + type)
      .pipe(
        map((elementsData) => {
          return elementsData.elem.map((element) => {
            return {
              _id: element._id,
              buttonText: element.buttonText,
              elementType: element.elementType,
              elementPosition: element.elementPosition,
              icon: element.icon,
              value: element.value,
              automation: element.automation,
            };
          });
        })
      )
      .subscribe((transformationsElements) => {
        this.elements = transformationsElements;
        this.elementsUpdated.next([...this.elements]);
      });
  }

  getElementsByPosition(position: string) {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(`${this.baseUrl}/elements/elementsPosition/` + position)
      .pipe(
        map((elementsData) => {
          return elementsData.elem.map((element) => {
            return {
              _id: element._id,
              buttonText: element.buttonText,
              elementType: element.elementType,
              elementPosition: element.elementPosition,
              icon: element.icon,
              value: element.value,
              automation: element.automation,
            };
          });
        })
      )
      .subscribe((transformationsElements) => {
        this.elements = transformationsElements;
        this.elementsUpdated.next([...this.elements]);
      });
  }

  getElementUpdateListener() {
    return this.elementsUpdated.asObservable();
  }

  addElementBase() {
    const element: MainMenuCategoryDtos = {
      buttonText: 'string',
      elementType: 'string',
      elementPosition: 'string',
      icon: 'string',
      value: 'string | boolean',
      automation: false,
    };
    this.http.post<{ message: string }>(`${this.baseUrl}/elements`, element).subscribe(() => {
      this.elements.push(element);
      this.elementsUpdated.next([...this.elements]);
    });
  }

  updateElement(_id: string, buttonText: string, elementType: string, elementPosition: string, icon: string, value: string | boolean, automation: boolean) {
    const userId = localStorage.getItem('userId');
    const element: MainMenuCategoryDtos = {
      _id: _id,
      buttonText: buttonText,
      elementType: elementType,
      elementPosition: elementPosition,
      icon: icon,
      value: value,
      automation: automation,
      userId: userId,
    };
    this.http.put(`${this.baseUrl}/elements/` + _id, element).subscribe(() => {
      const updatedElement = [...this.elements];
      const oldElementIndex = updatedElement.findIndex((p) => p._id === element._id);
      updatedElement[oldElementIndex] = element;
      this.elements = updatedElement;
      this.elementsUpdated.next([...this.elements]);
    });
  }
  generateFaceIdModel(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.post<{ message: string }>(
      `http://192.168.1.103:5000/start_face_collection`,
      { person_id: userId, duration: 10 },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
