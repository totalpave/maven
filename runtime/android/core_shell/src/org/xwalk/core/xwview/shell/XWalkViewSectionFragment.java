// Copyright (c) 2014 Intel Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.xwalk.core.xwview.shell;

import android.app.Activity;
import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import org.xwalk.core.XWalkView;

public class XWalkViewSectionFragment extends Fragment{
    private XWalkView mXWalkView;
    private OnXWalkViewCreatedListener mListener;

    public interface OnXWalkViewCreatedListener {
        public void onXWalkViewCreated(XWalkView view);
    }

    public XWalkViewSectionFragment() {
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnXWalkViewCreatedListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement OnXWalkViewCreatedListener");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_main, container, false);
        mXWalkView = (XWalkView) rootView.findViewById(R.id.xwalkview);
        mListener.onXWalkViewCreated(mXWalkView);
        return rootView;
    }

    public XWalkView getXWalkView() {
        return mXWalkView;
    }
}
