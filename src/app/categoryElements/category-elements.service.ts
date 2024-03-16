import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CategoryElementsService {
  private elements: MainMenuCategoryDtos[] = [];
  private elementsUpdated = new Subject<MainMenuCategoryDtos[]>();

  constructor(private http: HttpClient) {}

    getToken(username: string, password: string) {
      this.http.post<{token: string}>('http://localhost:3000/api/login', { username, password })
      .subscribe(response => {
        localStorage.setItem('token', response.token); // Zapisz token pod kluczem 'token'
      }, error => {
      console.error('Błąd logowania:', error);
    });
}

   private getAuthHeaders() {
    const utoken = localStorage.getItem('userToken'); // Pobierz token z localStorage
        const token = localStorage.getItem('userToken'); // Pobierz token z localStorage

    console.log(token);
        console.log(utoken);
    return new HttpHeaders().set('Authorization', token ? token : '');
  }

  getAllElements() {
    this.http
      .get<{ message: string; elem: MainMenuCategoryDtos[] }>(
        'http://localhost:3000/api/elements' , { headers: this.getAuthHeaders()}
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
        'http://localhost:3000/api/elements/elementsType/' + type , { headers: this.getAuthHeaders()}
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
        'http://localhost:3000/api/elements/elementsPosition/' + position , { headers: this.getAuthHeaders()}
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
      .post<{ message: string }>('http://localhost:3000/api/elements', element)
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
      .put('http://localhost:3000/api/elements/' + _id, element)
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
