import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CategoryElementsService {
  private elements: MainMenuCategoryDtos[] = [];
  private elementsUpdated = new Subject<MainMenuCategoryDtos[]>();

  constructor(private http: HttpClient) {}
  private baseUrl = 'http://192.168.137.108:3000/api';

    getToken(username: string, password: string) {
      this.http.post<{token: string}>(`${this.baseUrl}/login`, { username, password })
      .subscribe(response => {
        localStorage.setItem('token', response.token); // Zapisz token pod kluczem 'token'
      }, error => {
      console.error('Błąd logowania:', error);
    });
}

getTokenFromStorage(): string | null {
  const token = localStorage.getItem('token');
  if (token) return token;
  
  else return 'TwojSekretnyTokenTutaj';
};

 
  getAllElements() {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(
        `${this.baseUrl}/elements` 
      )
      .pipe(
        map((elementsData) => {
          return elementsData.elem.map((element) => {
            return {
              _id:element._id,
              buttonText:element.buttonText,
              elementType:element.elementType,
              elementPosition:element.elementPosition,
              icon:element.icon,
              value:element.value,
              automation:element.automation
            };
          });
        })
      )
      .subscribe((transformationsElements) => {
        this.elements = transformationsElements;
        this.elementsUpdated.next([...this.elements]);
      });
  }

  getElementsByType(type:string) {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(
        `${this.baseUrl}/elements/elementsType/` + type , 
      )
      .pipe(
        map((elementsData) => {
          return elementsData.elem.map((element) => {
            return {
              _id:element._id,
              buttonText:element.buttonText,
              elementType:element.elementType,
              elementPosition:element.elementPosition,
              icon:element.icon,
              value:element.value,
              automation:element.automation
            };
          });
        })
      )
      .subscribe((transformationsElements) => {
        this.elements = transformationsElements;
        this.elementsUpdated.next([...this.elements]);
      });
  }

  getElementsByPosition(position:string) {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(
        `${this.baseUrl}/elements/elementsPosition/` + position 
      )
      .pipe(
        map((elementsData) => {
          return elementsData.elem.map((element) => {
            return {
              _id:element._id,
              buttonText:element.buttonText,
              elementType:element.elementType,
              elementPosition:element.elementPosition,
              icon:element.icon,
              value:element.value,
              automation:element.automation
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

  addElementBase(
  ) {
    const element : MainMenuCategoryDtos ={
    buttonText:'string',
    elementType:'string',
    elementPosition:'string',
    icon:'string',
    value:"string | boolean",
    automation:false
    }
    this.http
      .post<{ message: string }>(`${this.baseUrl}/elements`, element)
      .subscribe(() => {
        this.elements.push(element);
        this.elementsUpdated.next([...this.elements]);
      });
  }

  updateElement(
    _id:string,
    buttonText:string,
    elementType:string,
    elementPosition:string,
    icon:string,
    value:string | boolean,
    automation:boolean,
  ) {
    const element: MainMenuCategoryDtos = {
      _id:_id,
    buttonText:buttonText,
    elementType:elementType,
    elementPosition:elementPosition,
    icon:icon,
    value:value ,
    automation:automation,
    };
    this.http
      .put(`${this.baseUrl}/elements/` + _id, element)
      .subscribe(() => {
        const updatedElement = [...this.elements];
        const oldElementIndex = updatedElement.findIndex(
          (p) => p._id === element._id
        );
        updatedElement[oldElementIndex] = element;
        this.elements = updatedElement;
        this.elementsUpdated.next([...this.elements]);
      });
  }
}
