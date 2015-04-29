/**
 * Created by austinrhodes on 4/28/15.
 */
function adSort (arr) {

    var merge = function (left, right) {
        /* Create Variables */
        var i = 0, result = new Array(left.length + right.length);

        /* If the uppermost element of the left array is less than or equal to the lowermost
         * element of the right array, then they should be placed together in the order [left][right]
         */
        if (left[left.length - 1] <= right[0]) {
            result = left.concat(right);
        }
        /* If the uppermost element of the right array is less than or equal to the lowermost
         * element of the left array, then they should be placed together in the order [right][left]
         */
        else if (right[right.length - 1] < left[0]) {
            result = right.concat(left);
        }
        /* Otherwise there is an overlap between the two arrays */
        else {
            var r = 0,
                l = 0,
                right_value = right[r],
                left_value = left[l];
            while (r + l < left.length + right.length) {
                /* if the right array element is less than the left array element, place it in the current
                 * output array index
                 */
                if (right_value < left_value) {
                    result[r + l] = right_value;
                    /* If we haven't reached the end of the array, reassign the right value to be the next right
                     array element */
                    if (++r < right.length) {
                        right_value = right[r];
                    }
                    /* Otherwise place the remaining left array elements in the return array */
                    else {
                        while (l < left.length) {
                            result[r + l] = left[l++];
                        }
                    }
                }
                else {
                    /* Otherwise the left array element is less than the right array element, place it in the
                     * current output array index
                     */
                    result[r + l] = left_value;
                    /* If we haven't reached the end of the array, reassign the left value to be the next right
                     * array element
                     */
                    if (++l < left.length) {
                        left_value = left[l];
                    }
                    /* Otherwise place the remaining right array elements in the return array */
                    else {
                        while (r < right.length) {
                            result[r + l] = right[r++];
                        }
                    }
                }
            }
        }
        /* Make the local left and right arrays eligible for garbage collection */
        left = right = null;
        return result;
    }

    var aChain = function (arr, offset, bound) {
        /* Find the ending index of the non-strictly ascending ordered sub-array of arr */
        /* Create variables and assign temp to be the starting offset of the array */
        var temp = arr[offset], next;
        /* As long as the offset is not outside the upper bound, and the temp variable is less than
         * or equal to the next value in the array (non-strict) reassign the temp variable
         */
        while (++offset < bound && temp <= (next = arr[offset])) {
            temp = next;
        }
        /* Make the local arr variable available for garbage collection */
        arr = null;
        /* Return the new offset */
        return offset;
    }

    function dChain(arr, offset, bound) {
        /* Find the ending index of the strictly descending ordered sub-array of arr */
        /* Create variables and assign temp to be the starting offset of the array */
        var temp = arr[offset], next;
        /* As long as the offset is not outside the upper bound, and the temp variable is greater than
         * or the next value in the array (strict) reassign the temp variable
         */
        while (++offset < bound && temp > (next = arr[offset])) {
            temp = next;
        }
        /* Make the local arr variable available for garbage collection */
        arr = null;
        /* Return the new offset */
        return offset;
    }

    var unitSort = function (arr) {
        /* Create array of chains that are pre-sorted */
        var endpoint,
            len = arr.length,
            tmp = [],
            return_arr = [],
            k = 0,
            ascending_descending = aChain;
        /* While we aren't pointing to the end of the array */
        while (k < len) {
            endpoint = ascending_descending(arr, k, len);
            /* If we found more than one in the chain */
            if (endpoint - k > 1) {
                /* Descending chain was found, so reverse and push subarray */
                if (ascending_descending === dChain) {
                    return_arr.push(arr.slice(k, endpoint).reverse());
                }
                /* Ascending chain was found so push */
                else {
                    return_arr.push(arr.slice(k, endpoint));
                }
            }
            /* Didn't find ascending chain, just a singular element,
             * so switch to finding descending chain.
             */
            else if (ascending_descending === aChain) {
                return_arr.push(arr.slice(k, ++endpoint).reverse());
                ascending_descending = dChain;
            }
            /* Didn't find descending chain, just a singular element,
             * so switch to finding ascending chain (default).
             */
            else {
                return_arr.push(arr.slice(k, ++endpoint));
                ascending_descending = aChain;
            }
            k = endpoint;
        }
        /* Clear memory and return array */
        arr = null;
        return return_arr;
    }

    var unitJoin = function (arr) {
        /* Join all the chains in the passed in array */
        var j = arr.length, temp = [];
        if (j < 1) {
            return arr;
        }
        /* Run as long as the length of the array minus 2 is greater than 1 */
        while(j>1){
            var k, lim = arr.length - 2;
            /* Run for the length of the array minus 2 */
            j = k = 0;
            while(k<lim){
                /* Place the merged values into the array and increment the counter by 2 */
                arr[j++] = merge(arr[k], arr[k + 1]);
                k = j * 2;
            }
            /* If we overshot the limit, then place the final value in the array */
            if(k > lim){
                arr[j++] = arr[k];
            }
            /* Otherwise, merge and place the final 2 values into the array */
            else{
                arr[j++] = merge(arr[k],arr[k+1]);
            }
            /* Update the array length */
            arr.length = j
        }
        /* Free memory and return */
        var result = arr.shift();
        arr = null;
        return result;


    }




    // immutable version -- store result in a separate location
    //return chain_join(chain_unit(arr));

    //mutable (standard) version -- store result in-place
    var temp = unitJoin(unitSort(arr)), len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i] = temp[i];
    }
    temp = null;
    return arr;
}

Array.prototype.adSort = function() {
    return adSort(this);
}