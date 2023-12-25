// 13: 20 14: 20 15: 20 16: 20 <- ->

// 14: 20

// 13: 20 15: 20 16: 20 17: 20new

// HashMap
// [
//     1 => { value, #ref0a(13: 20) }
//     2 => { value, #ref0b(14: 20) }
//     3 => { value, #ref0c(15: 20) }
//     4 => { value, #ref0d (16:20)}
// ]

// get(2);

// 13: 20 14: 20 15: 20 16: 20

// 13: 20 15: 20 16: 20 17: 20

class LRUCache {
  constructor(capacity) {
    //validate capaciiy is possitive
    this.capacity = capacity;
    this.map = {};
    this.timeStampListHead = { next: null, prev: null };
  }

  get(key) {
    const data = this.map[key];
    if (value === undefined) {
      return -1;
    }
    this.put(key, data.value);
    return data.value;
  }

  put(key, value) {
    const data = this.map[key];
    if (this.capacity == Object.keys(this.map).length && !data) {
      popFromList(this.timeStampListHead);
      this.map[key] = undefined;
    }

    if (value == null) {
      const prevHead = this.timeStampListHead;
      this.timeStampListHead = { next: prevHead, prev: null };
      prevHead.prev = this.timeStampListHead;
      this.map[key].ref = this.timeStampListHead;
    } else {
      popFromList(data.ref);
      addToListHead(data.ref, value);
    }
    this.map[key].value = value;
  }

  popFromList(ref) {
    const isHead = this.timeStampListHead === ref;
    if (isHead) {
      this.timeStampListHead = { next: null, prev: null };
    } else {
      ref.prev.next = ref.next;
      ref.next.prev = ref.prev;
    }
  }

  addToListHead(ref) {
    const prevHead = this.timeStampListHead;
    this.timeStampListHead = ref;
    prevHead.prev = this.timeStampListHead;
    ref.next = prevHead;
    ref.prev = null;
  }
}
